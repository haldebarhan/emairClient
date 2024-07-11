import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitToFive',
  standalone: true,
})
export class LimitToFivePipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.slice(0, 5);
  }
}
