import { Block } from '../core/Block';

export function render(query: string, block: Block): HTMLElement | null {
  const root = document.querySelector(query);

  if (!root) {
    return null;
  }

  const content = block.getContent();
  if (content) {
    root.appendChild(content);
    block.dispatchComponentDidMount();
  }

  return root as HTMLElement;
}
