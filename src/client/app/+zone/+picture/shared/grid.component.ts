import {
  Component, Input, Output,
  EventEmitter, OnChanges,
  //HostListener,
  KeyboardEvent
}                          from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Photo} from '../../../shared/models/photo.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-gridview',
  templateUrl: 'grid.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  host: {
    '(document:keydown)': 'onDocumentKeyDown($event)',
    '(document:keyup)': 'onDocumentKeyUp($event)',
  }
})

export class ZPictureGridComponent implements OnChanges {
  @Input() data: Array<Photo>;
  @Output() imgDetail: EventEmitter<number> = new EventEmitter<number>();
  dataImages: Array<Photo> = [];
  dataAddImages: Array<any> = [];

  keyCtrl: boolean = false;


  /*@HostListener('document:keyup', ['$event']);
   onKeyUp(ev:KeyboardEvent) {
   // do something meaningful with it
   console.log(`The user just pressed ${ev.key}!`);
   }*/

  onDocumentKeyDown(ev: KeyboardEvent) {
    if (ev.key == 'Control' || ev.key == 'Meta') {
      this.keyCtrl = true;
    }
  }

  onDocumentKeyUp(ev: KeyboardEvent) {
    if (ev.key == 'Control' || ev.key == 'Meta') {
      this.keyCtrl = false;
    }
  }

  ngOnChanges() {
    this.dataImages = this.data;
  }

  ondbClick(id: any) {
    this.imgDetail.emit(id);
  }

  /**
   *
   * @param e
   * @param id of Image
   */
  onSelected(e: any, id: number) {
    let parent = $(e.target).parents('.row-img');
    let el = $(e.target).parents('.photo-box-img');

    if (!this.keyCtrl) {
      this.dataAddImages = [];
      if (el.hasClass('selected')) {
        el.removeClass('selected');
      } else {
        parent.find('.photo-box-img').removeClass('selected');
        el.addClass('selected');
        this.dataAddImages.push(id); // add
      }
    } else {
      el.toggleClass('selected');
      if (_.indexOf(this.dataAddImages, id) >= 0) {
        _.pull(this.dataAddImages, id); // remove
      } else {
        this.dataAddImages.push(id); // add
      }
    }
    console.log(this.dataAddImages);
  }
}
