import { EventBus } from './EventBus';
import { set, cloneDeep } from '../utils';

export enum StoreEvents {
  Updated = 'updated',
}

type Indexed = Record<string, any>;

class Store extends EventBus {
  private state: Indexed = {};

  public getState() {
    return cloneDeep(this.state);
  }

  public set(path: string, value: unknown) {
    set(this.state, path, value);
    this.emit(StoreEvents.Updated);
  }
}

export default new Store();
