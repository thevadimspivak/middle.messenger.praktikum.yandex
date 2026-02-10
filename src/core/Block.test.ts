import { describe, it, expect } from '@jest/globals';
import { Block } from './Block';

class TestComponent extends Block {
  protected render(): string {
    return `<div class="test">${this.props.text || ''}</div>`;
  }
}

describe('Block', () => {
  it('должен обновить props и перерендерить компонент', () => {
    const component = new TestComponent('div', { text: 'Initial Text' });

    expect(component.getContent()?.innerHTML).toContain('Initial Text');

    component.setProps({ text: 'Updated Text' });

    expect(component.getContent()?.innerHTML).toContain('Updated Text');
  });
});
