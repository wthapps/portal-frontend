/**
 * <read-more [maxheight]="120">
 *  <div [innerHtml]="item.description | newline"></div>
 * </read-more>
 */

import { Component, OnInit, OnChanges, AfterViewInit, Input } from '@angular/core';

declare var $: any;
declare var shave: any;

@Component({
  selector: 'read-more',
  template: `
        <div class="wth-read-more-wrap word-break">
            <div class="wth-read-more-in">
              <ng-content></ng-content>
            </div>
            <a href="javascript:;" class="wth-read-more-btn" (click)="onClick($event)">{{isCollapsedText}}</a>
        </div>
    `,
  styles: [`
        .wth-read-more-btn{display:none};
    `]
})

export class ReadMoreComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() maxheight: number = 120;

  isCollapsedText: string = 'READ MORE';

  ngOnInit() {

  }

  ngOnChanges() {

  }

  ngAfterViewInit() {
    let maxheight = this.maxheight;
    $('.wth-read-more-in').shave(maxheight);
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
