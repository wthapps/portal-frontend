/**
 <read-more [limit]="120" [content]="item.description" [readmore]="' See More'" [readless]="' See Less'">
 </read-more>
 */

import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'read-more',
  templateUrl: 'read-more.component.html',
  styleUrls: ['read-more.component.scss']
})

export class ReadMoreComponent implements OnChanges {
  @Input() limit = 120;
  @Input() content = '';
  @Input() readmore = ' VIEW MORE';
  @Input() readless = ' VIEW LESS';

  shaveContent = '';
  showMore = false;

  ngOnChanges(data: any): void {
    // if(this.content)
    //   return;
    this.content = this.content.replace(/(\r\n|\n\r|\r|\n)/g, ' <br> ');
    const value = this.content;
    let limit = this.limit;
    // let trail = this.readmore;
    const words = value.split(/\s+/);
    if (words.length > Math.abs(limit)) {
      if (limit < 0) {
        limit *= -1;
        // this.shaveContent = trail + words.slice(words.length - limit, words.length).join(' ');
        this.shaveContent = words.slice(words.length - limit, words.length).join(' ');
      } else {
        // this.shaveContent = words.slice(0, limit).join(' ') + trail;
        this.shaveContent = words.slice(0, limit).join(' ');
      }
    } else {
      this.showMore = true;
    }
  }

  onShowMore(e: any): void {
    this.showMore = !this.showMore;
  }

}
