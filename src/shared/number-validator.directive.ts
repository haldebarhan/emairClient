import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function numericValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = !isNaN(parseFloat(control.value)) && isFinite(control.value);
      return isValid ? null : { 'numeric': { value: control.value } };
    };
  }