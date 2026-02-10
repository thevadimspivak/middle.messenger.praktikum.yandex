import store, { StoreEvents } from '../core/Store';
import { isEqual } from './isEqual';
import { Block } from '../core/Block';

type Indexed = Record<string, any>;

type BlockConstructor = new (...args: any[]) => Block;

export function connect<T extends BlockConstructor>(
  mapStateToProps: (state: Indexed) => Indexed,
) {
  return function wrap(Component: T): T {
    return class extends Component {
      constructor(...args: any[]) {
        let state = mapStateToProps(store.getState());

        if (args.length === 0) {
          super('div', state);
        } else if (args.length === 1) {
          super(args[0], state);
        } else {
          super(args[0], { ...args[1], ...state });
        }

        store.on(StoreEvents.Updated, () => {
          const newState = mapStateToProps(store.getState());

          if (!isEqual(state, newState)) {
            this.setProps({ ...newState });
          }

          state = newState;
        });
      }
    } as T;
  };
}
