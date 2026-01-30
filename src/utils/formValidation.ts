import { validateField } from './validation';

function showError(
  input: HTMLInputElement,
  errorElement: HTMLSpanElement,
  message: string,
): void {
  input.classList.add('form__input--error');
  const element = errorElement;
  element.textContent = message;
  element.style.display = 'block';
}

function hideError(input: HTMLInputElement, errorElement: HTMLSpanElement): void {
  input.classList.remove('form__input--error');
  const element = errorElement;
  element.textContent = '';
  element.style.display = 'none';
}

export function setupFormValidation(form: HTMLFormElement): void {
  const inputs = form.querySelectorAll<HTMLInputElement>('.form__input');

  inputs.forEach((input) => {
    const errorElement = input
      .closest('.form__group')
      ?.querySelector<HTMLSpanElement>('.form__error');

    if (!errorElement) {
      return;
    }

    input.addEventListener('blur', () => {
      const error = validateField(input.name, input.value);
      if (error) {
        showError(input, errorElement, error);
      } else {
        hideError(input, errorElement);
      }
    });

    input.addEventListener('focus', () => {
      hideError(input, errorElement);
    });
  });

  form.addEventListener('submit', (event) => {
    let hasErrors = false;

    inputs.forEach((input) => {
      const errorElement = input
        .closest('.form__group')
        ?.querySelector<HTMLSpanElement>('.form__error');

      if (!errorElement) {
        return;
      }

      const error = validateField(input.name, input.value);
      if (error) {
        showError(input, errorElement, error);
        hasErrors = true;
      } else {
        hideError(input, errorElement);
      }
    });

    if (hasErrors) {
      event.preventDefault();
    }
  });
}
