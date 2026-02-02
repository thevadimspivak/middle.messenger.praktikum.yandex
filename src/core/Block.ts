import { EventBus } from './EventBus';

export interface BlockProps {
  // any нужен для index signature, конкретные типы задаются в наследниках
  [key: string]: any;
  events?: Record<string, (event: Event) => void>;
}

interface BlockChild {
  dispatchComponentDidMount(): void;
  getContent(): HTMLElement | null;
}

export class Block<P extends BlockProps = BlockProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _element: HTMLElement | null = null;

  private _meta: { tagName: string; props: P };

  protected props: P;

  protected eventBus: () => EventBus;

  protected children: Record<string, BlockChild>;

  public id: string;

  constructor(tagName: string = 'div', propsAndChildren: P = {} as P) {
    const eventBus = new EventBus();

    const { children, props } = this._getChildren(propsAndChildren);

    this.children = children;
    this.id = Math.random().toString(36).substring(2, 9);

    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildren(propsAndChildren: P): { children: Record<string, BlockChild>; props: P } {
    const children: Record<string, BlockChild> = {};
    const props = {} as P;

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key as keyof P] = value;
      }
    });

    return { children, props };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources(): void {
    const { tagName } = this._meta;
    this._element = document.createElement(tagName);
  }

  private _init(): void {
    this._createResources();
    this.init();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected init(): void {
    // Может переопределяться пользователем
  }

  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  protected componentDidMount(): void {
    // Может переопределяться пользователем
  }

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (response) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(oldProps: P, newProps: P): boolean {
    // Может переопределяться пользователем
    // oldProps и newProps используются в дочерних классах
    return oldProps !== newProps;
  }

  public setProps = (nextProps: Partial<P>): void => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const block = this.render();

    if (this._element) {
      this._removeEvents();
      this._element.innerHTML = block;
      this._addEvents();
    }
  }

  private _parseEventName(eventName: string): { event: string; selector: string } {
    const [event, selector] = eventName.split(' ');
    return { event, selector };
  }

  private _addEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      const { event, selector } = this._parseEventName(eventName);

      if (selector) {
        const elements = this._element?.querySelectorAll(selector);
        elements?.forEach((element) => {
          element.addEventListener(event, events[eventName]);
        });
      } else {
        this._element?.addEventListener(event, events[eventName]);
      }
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      const { event, selector } = this._parseEventName(eventName);

      if (selector) {
        const elements = this._element?.querySelectorAll(selector);
        elements?.forEach((element) => {
          element.removeEventListener(event, events[eventName]);
        });
      } else {
        this._element?.removeEventListener(event, events[eventName]);
      }
    });
  }

  protected render(): string {
    return '';
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: P): P {
    const self = this;

    return new Proxy(props, {
      get(target: P, prop: string | symbol) {
        const value = target[prop as keyof P];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: P, prop: string | symbol, value: unknown): boolean {
        const oldProps = { ...target };
        target[prop as keyof P] = value as P[keyof P];
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty(): boolean {
        throw new Error('Нет доступа');
      },
    });
  }

  public show(): void {
    if (this._element) {
      this._element.style.display = 'block';
    }
  }

  public hide(): void {
    if (this._element) {
      this._element.style.display = 'none';
    }
  }

  protected mountComponent(
    containerSelector: string,
    childKey: keyof typeof this.children,
  ): void {
    const container = this.element?.querySelector(containerSelector);
    const child = this.children[childKey];
    const content = child?.getContent();

    if (container && content) {
      container.appendChild(content);
      child.dispatchComponentDidMount();
    }
  }

  protected mountComponents(
    containerSelector: string,
    childKeys: Array<keyof typeof this.children>,
  ): void {
    childKeys.forEach((key) => {
      this.mountComponent(containerSelector, key);
    });
  }
}
