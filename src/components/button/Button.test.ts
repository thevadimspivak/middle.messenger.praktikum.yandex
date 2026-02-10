import { describe, it, expect } from '@jest/globals';
import { Button } from './Button';

describe('Button', () => {
  it('должен отрендерить кнопку с правильным текстом и типом', () => {
    const button = new Button({
      text: 'Click me',
      type: 'primary',
      buttonType: 'submit',
    });

    const content = button.getContent();

    expect(content?.innerHTML).toContain('Click me');
    expect(content?.innerHTML).toContain('button--primary');
    expect(content?.innerHTML).toContain('type="submit"');
  });
});
