import { BlockProps } from '../../core';

export interface FormProps<T = Record<string, string>> extends BlockProps {
  onSubmit?: (formData: T) => void;
  className?: string;
}

export interface Validatable {
  validate?: () => string | null;
}
