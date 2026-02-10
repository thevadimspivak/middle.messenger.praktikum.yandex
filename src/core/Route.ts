import { Block } from './Block';

interface RouteProps {
  rootQuery: string;
  isProtected?: boolean;
}

type BlockConstructor = new (...args: any[]) => Block;

export class Route {
  private _pathname: string;

  private _blockClass: BlockConstructor;

  private _block: Block | null;

  private _props: RouteProps;

  public isProtected: boolean;

  constructor(pathname: string, view: BlockConstructor, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
    this.isProtected = props.isProtected || false;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      const root = document.querySelector(this._props.rootQuery);
      if (root) {
        root.innerHTML = '';
      }
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
    }
    this._renderBlock();
  }

  private _renderBlock(): void {
    const root = document.querySelector(this._props.rootQuery);

    if (!root) {
      return;
    }

    const content = this._block?.getContent();

    if (content) {
      root.innerHTML = '';
      root.appendChild(content);
      this._block?.dispatchComponentDidMount();
    }
  }
}
