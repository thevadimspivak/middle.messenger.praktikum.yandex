export type FormValues = Record<string, string>;

export function getFormValues<T = FormValues>(form: HTMLFormElement): T {
  const formData = new FormData(form);
  const values: Record<string, string> = {};

  formData.forEach((value, key) => {
    values[key] = value.toString();
  });

  return values as T;
}
