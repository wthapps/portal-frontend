import {
  Directive, ElementRef, AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[displayAsHtml]'
})
export class DisplayAsHtmlDirective implements AfterViewInit {

  constructor(private element: ElementRef) {
  }


  ngAfterViewInit() {
    console.log('setting value', this.element.nativeElement.innerHTML);
    this.element.nativeElement.innerHTML = this.encode4HTML(this.element.nativeElement.innerHTML.toString());
  }


  private encode4HTML(str: string): string {
    return str
      // .replace(/\r\n?/g,'\n')
      // normalize newlines - I'm not sure how these
      // are parsed in PC's. In Mac's they're \n's
      // .replace(/(^((?!\n)\s)+|((?!\n)\s)+$)/gm,'')
      // trim each line
      // .replace(/(?!\n)\s+/g,' ')
      // reduce multiple spaces to 2 (like in "a    b")
      // .replace(/^\n+|\n+$/g,'')
      // trim the whole string
      // .replace(/[<>&"' ]/g, (a: string) => {
      //   // replace these signs with encoded versions
      //   switch (a) {
      //     // case '<'    : return '&lt;';
      //     // case '>'    : return '&gt;';
      //     // case '&'    : return '&amp;';
      //     // case '"'    : return '&quot;';
      //     // case '\''   : return '&apos;';
      //     // case ' '    : return '&nbsp;';
      //   }
      // })
      // .replace(/\n{2,}/g,'</p><p>')
      // replace 2 or more consecutive empty lines with these
      // .replace(/<\/i>\s*/g, '</i>&nbsp;')
      // .replace(/\s*<i/g, '&nbsp;<i')



      // .replace(/<(?!\/?i(?=>|\s.*>))\/?.*?>/g, '&nbsp;')
      .replace(/<[^<>]*>|( )/g, '&nbsp;');

      // .replace(/\n/g,'<br />');
      // replace single newline symbols with the <br /> entity
      // .replace(/^(.+?)$/,'<p>$1</p>');
    // wrap all the string into <p> tags
    // if there's at least 1 non-empty character
  }
}

