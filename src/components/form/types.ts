import { BlockProps } from '../../core';

export interface FormProps extends BlockProps {
  onSubmit?: (formData: Record<string, string>) => void;
  className?: string;
}
