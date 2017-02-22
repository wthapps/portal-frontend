/**
 * <read-more [maxheight]="120">
 *  <div [innerHtml]="item.description | newline"></div>
 * </read-more>
 */

import { Component, AfterViewInit, Input } from '@angular/core';

declare var $: any;

@Component({
  selector: 'read-more',
  template: `
        <div class="wth-read-more-wrap word-break">
            <div class="wth-read-more-in" [innerHtml]="content|newline">
            </div>
            <a href="javascript:;" class="wth-read-more-btn" (click)="onClick($event)">{{isCollapsedText}}</a>
        </div>
    `,
  styles: [`
        .wth-read-more-btn{display:none};
    `]
})

export class ReadMoreComponent implements AfterViewInit {
  @Input() maxheight: number = 120;
  @Input() content: string = '';

  isCollapsedText: string = 'READ MORE';

  ngAfterViewInit() {
    let maxheight = this.maxheight;
    $('.js-shave-char').parents('.wth-read-more-wrap').find('.wth-read-more-btn').show();
  }

  onClick(e: any) {
    console.log(e.target.parentNode);
    $(e.target.parentNode).toggleClass('collapsed');
    $(e.target.parentNode).find('.js-shave-char').toggle();
    $(e.target.parentNode).find('.js-shave').toggle();

    e.target.textContent = (e.target.textContent == 'READ MORE' ? 'READ LESS' : 'READ MORE');
  }

}
