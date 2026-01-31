import { BlockProps } from '../../core';

export interface InputProps extends BlockProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
}
