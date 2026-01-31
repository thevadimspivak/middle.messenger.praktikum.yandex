const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type HTTPMethod = typeof METHODS[keyof typeof METHODS];

type Options = {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
};

type HTTPMethodFunc = <R = unknown>(url: string, options?: Options) => Promise<R>;

export function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const params = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return params ? `?${params}` : '';
}

export class HTTPTransport {
  get: HTTPMethodFunc = (url, options = {}) => this.request(
    url,
    { ...options, method: METHODS.GET },
    options.timeout,
  );

  post: HTTPMethodFunc = (url, options = {}) => this.request(
    url,
    { ...options, method: METHODS.POST },
    options.timeout,
  );

  put: HTTPMethodFunc = (url, options = {}) => this.request(
    url,
    { ...options, method: METHODS.PUT },
    options.timeout,
  );

  delete: HTTPMethodFunc = (url, options = {}) => this.request(
    url,
    { ...options, method: METHODS.DELETE },
    options.timeout,
  );

  request<R = XMLHttpRequest>(
    url: string,
    options: Options = {},
    timeout = 5000,
  ): Promise<R> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data as Record<string, unknown>)}` : url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => resolve(xhr as R);
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
