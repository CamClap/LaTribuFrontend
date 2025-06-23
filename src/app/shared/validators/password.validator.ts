import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasMinLength = value.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  return hasMinLength && hasLetter && hasNumber ? null : { passwordInvalid: true };
}
