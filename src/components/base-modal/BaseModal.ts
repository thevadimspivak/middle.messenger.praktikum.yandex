import { Block, BlockProps } from '../../core';

export interface BaseModalProps extends BlockProps {
  onClose?: () => void;
}

export abstract class BaseModal<T extends BaseModalProps = BaseModalProps> extends Block<T> {
  show() {
    super.show();
    document.body.style.overflow = 'hidden';
  }

  hide() {
    super.hide();
    document.body.style.overflow = '';
    setTimeout(() => {
      this.element?.remove();
    }, 300);
  }

  protected close() {
    this.hide();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
}
