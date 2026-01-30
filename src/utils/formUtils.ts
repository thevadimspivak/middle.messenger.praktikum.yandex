export type FormValues = Record<string, string>;

export function getFormValues(form: HTMLFormElement): FormValues {
  const formData = new FormData(form);
  const values: FormValues = {};

  formData.forEach((value, key) => {
    values[key] = value.toString();
  });

  return values;
}
