import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitToTen',
  standalone: true,
})
export class LimitToTenPipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.slice(0, 10);
  }
}
