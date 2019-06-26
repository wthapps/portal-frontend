import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'htmlToPlaintext' })
export class HtmlToPlaintextPipe implements PipeTransform {
  transform(htmlString: string) {
    return htmlString ? String(htmlString).replace(/<[^>]+>/gm, '') : '';;
  }
}
