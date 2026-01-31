import { BlockProps } from '../../core';

export interface ButtonProps extends BlockProps {
  type?: 'primary' | 'link' | 'danger';
  buttonType?: 'button' | 'submit' | 'reset';
  text: string;
}
