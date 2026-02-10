import { Block } from './Block';
import { Route } from './Route';

type BlockConstructor = new (...args: any[]) => Block;

interface RouteOptions {
  isProtected?: boolean;
}

export class Router {
  // eslint-disable-next-line no-use-before-define
  private static __instance: Router | null = null;

  private routes: Route[] = [];

  private history: History = window.history;

  private _currentRoute: Route | null = null;

  private _rootQuery!: string;

  private _checkAuth: (() => Promise<boolean>) | null = null;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      // eslint-disable-next-line no-constructor-return
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  setAuthCheck(checkAuth: () => Promise<boolean>): Router {
    this._checkAuth = checkAuth;
    return this;
  }

  use(pathname: string, block: BlockConstructor, options: RouteOptions = {}): Router {
    const route = new Route(pathname, block, {
      rootQuery: this._rootQuery,
      isProtected: options.isProtected,
    });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = ((event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname);
    });

    this._onRoute(window.location.pathname);
  }

  private async _onRoute(pathname: string): Promise<void> {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    if (this._checkAuth) {
      const isAuthenticated = await this._checkAuth();

      if (route.isProtected && !isAuthenticated) {
        this.go('/');
        return;
      }

      if (!route.isProtected && isAuthenticated && (pathname === '/' || pathname === '/sign-up')) {
        this.go('/messenger');
        return;
      }
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
