import { Modal, PromptModal } from '../components';

export function showModal(message: string, title?: string): void {
  const modal = new Modal({
    title,
    message,
  });

  const modalElement = modal.getContent();
  if (modalElement) {
    document.body.appendChild(modalElement);
    modal.dispatchComponentDidMount();
    modal.show();
  }
}

export function showPromptModal(
  title: string,
  placeholder: string,
  onSubmit: (value: string) => void,
): void {
  const modal = new PromptModal({
    title,
    placeholder,
    onSubmit,
  });

  const modalElement = modal.getContent();
  if (modalElement) {
    document.body.appendChild(modalElement);
    modal.dispatchComponentDidMount();
    modal.show();
  }
}
