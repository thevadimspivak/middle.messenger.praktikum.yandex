import {
  describe, it, expect, beforeEach, jest,
} from '@jest/globals';
import { HTTPTransport } from './HTTPTransport';

describe('HTTPTransport', () => {
  let http: HTTPTransport;
  let xhr: Partial<XMLHttpRequest>;
  let xhrMock: jest.Mock;

  beforeEach(() => {
    http = new HTTPTransport();
    xhr = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      onload: null,
      onerror: null,
      onabort: null,
      ontimeout: null,
      status: 200,
      response: JSON.stringify({ success: true }),
      withCredentials: false,
    };

    xhrMock = jest.fn(() => xhr);
    global.XMLHttpRequest = xhrMock as any;
  });

  it('должен выполнить GET запрос и вернуть ответ', async () => {
    const promise = http.get('/test', { data: { key: 'value' } });

    setTimeout(() => {
      if (xhr.onload) {
        xhr.onload.call(xhr as XMLHttpRequest, {} as ProgressEvent);
      }
    }, 0);

    const result = await promise;

    expect(xhr.open).toHaveBeenCalledWith('GET', expect.stringContaining('/test?key=value'));
    expect(result).toEqual({ success: true });
  });
});
