import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithSpaces',
  standalone: true,
})
export class NumberWithSpacesPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value !== 'number') {
      return value.toString();
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
