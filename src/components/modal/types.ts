import { BaseModalProps } from '../base-modal';

export interface ModalProps extends BaseModalProps {
  title?: string;
  message: string;
}
