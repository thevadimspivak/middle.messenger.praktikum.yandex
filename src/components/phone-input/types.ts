import { BlockProps } from '../../core';

export interface PhoneInputProps extends BlockProps {
  name: string;
  label: string;
  value?: string;
  error?: string;
}
