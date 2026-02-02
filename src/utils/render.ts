import { Block } from '../core';

export function render(query: string, block: Block): HTMLElement | null {
  const root = document.querySelector(query);

  if (!root) {
    console.error(`Element with selector "${query}" not found`);
    return null;
  }

  const content = block.getContent();
  if (content) {
    root.appendChild(content);
    block.dispatchComponentDidMount();
  }

  return root as HTMLElement;
}
