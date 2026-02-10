import {
  describe, it, expect, beforeEach,
} from '@jest/globals';
import { Router } from './Router';
import { Block } from './Block';

class TestPage extends Block {
  protected render(): string {
    return '<div>Test Page</div>';
  }
}

describe('Router', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('должен перейти по роуту и отрендерить компонент', () => {
    const router = new Router('#app');
    router.use('/test', TestPage);
    router.start();

    router.go('/test');

    const appElement = document.querySelector('#app');
    expect(appElement?.innerHTML).toContain('Test Page');
  });
});
