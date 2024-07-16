import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitToEight',
  standalone: true,
})
export class LimitToEightPipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.slice(0, 8);
  }
}
