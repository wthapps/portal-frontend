import { Pipe, PipeTransform } from '@angular/core';

const escape = (s: any) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, arg: string): string {
    if (!arg.trim()) {
      return value;
    }

    try {
      const regex = new RegExp(`(${escape(arg)})`, 'i');
      return value.replace(regex, '<b>$1</b>');
    } catch (e) {
      return value;
    }
  }
}
