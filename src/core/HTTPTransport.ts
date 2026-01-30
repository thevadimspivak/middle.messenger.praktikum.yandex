type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Options = {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
};

type OptionsWithoutMethod = Omit<Options, 'method'>;

export function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}

export class HTTPTransport {
  get(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'GET' }, options.timeout);
  }

  post(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'POST' }, options.timeout);
  }

  put(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'PUT' }, options.timeout);
  }

  delete(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: 'DELETE' }, options.timeout);
  }

  request(url: string, options: Options = {}, timeout = 5000): Promise<XMLHttpRequest> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === 'GET';

      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data as Record<string, unknown>)}` : url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function onLoad() {
        resolve(xhr);
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Request failed'));

      xhr.timeout = timeout;
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data as string);
      }
    });
  }
}
