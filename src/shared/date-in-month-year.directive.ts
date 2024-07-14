import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateInMonthYearValidator(month: number, year: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const date = new Date(control.value);
    const startDate = new Date(year, month - 1, 1); // Premier jour du mois
    const endDate = new Date(year, month, 0); // Dernier jour du mois

    const isValid = date >= startDate && date <= endDate;

    return isValid ? null : { dateInMonthYear: { value: control.value } };
  };
}
