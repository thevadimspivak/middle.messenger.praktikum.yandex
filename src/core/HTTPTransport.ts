import { API_CONFIG } from '../config';
import queryStringify from '../utils/queryStringify';

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

  request<R = unknown>(
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
      const isFormData = data instanceof FormData;

      xhr.open(
        method,
        isGet && !!data
          ? `${API_CONFIG.BASE_URL}${url}?${queryStringify(data as Record<string, unknown>)}`
          : `${API_CONFIG.BASE_URL}${url}`,
      );

      xhr.withCredentials = true;

      if (!isFormData) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = xhr.response ? JSON.parse(xhr.response) : {};
            resolve(response as R);
          } catch {
            resolve(xhr.response as R);
          }
        } else {
          let errorMessage = `${xhr.status} ${xhr.statusText}`;

          try {
            const errorResponse = xhr.response ? JSON.parse(xhr.response) : {};
            if (errorResponse.reason) {
              errorMessage = errorResponse.reason;
            }
          } catch {
            // Ignore
          }

          reject(new Error(errorMessage));
        }
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Request failed'));

      xhr.timeout = timeout;
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (isGet || !data) {
        xhr.send();
      } else if (isFormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
