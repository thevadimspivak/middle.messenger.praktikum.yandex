import { HTTPTransport } from '../core/HTTPTransport';

export abstract class BaseAPI {
  protected http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport();
  }

  create(): Promise<unknown> {
    throw new Error('Not implemented');
  }

  read(): Promise<unknown> {
    throw new Error('Not implemented');
  }

  update(_id: string | number, data: unknown): Promise<unknown> {
    return Promise.reject(new Error(`Not implemented: ${_id}, ${data}`));
  }

  delete(): Promise<unknown> {
    throw new Error('Not implemented');
  }
}
