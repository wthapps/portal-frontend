import {
  Component, Input, Output,
  EventEmitter, OnChanges
  //HostListener,
}                          from '@angular/core';

import { Photo } from '../../../shared/models/photo.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-gridview',
  templateUrl: 'grid.component.html',
  host: {
    '(document:keydown)': 'onDocumentKeyDown($event)',
    '(document:keyup)': 'onDocumentKeyUp($event)'
  }
})

export class ZPictureGridComponent implements OnChanges {
  @Input() items: Array<any>;
  @Output() preview: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() loadMore: EventEmitter<number> = new EventEmitter<number>();
  @Input() resetSelected: boolean;

  selectedPhotos: Array<any> = [];

  keyCtrl: boolean = false;
  reset: boolean;

  constructor() {

  }

  /*@HostListener('document:keyup', ['$event']);
   onKeyUp(ev:KeyboardEvent) {
   // do something meaningful with it
   console.log(`The user just pressed ${ev.key}!`);
   }*/

  onDocumentKeyDown(ev: KeyboardEvent) {
    // console.log(ev);
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = true;
    }
  }

  onDocumentKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = false;
    }
  }

  ngOnChanges() {
    if (this.reset != this.resetSelected) {
      this.removeSelectedItems();
    }
    this.reset = this.resetSelected;
  }

  onDbClick(e: any, id: number) {
    let parent = $(e.target).parents('.row-img');
    let el = $(e.target).parents('.photo-box-img');
    parent.find('.photo-box-img').removeClass('selected');
    el.addClass('selected');

    this.selectedPhotos = [];
    this.selectedPhotos.push(id);

    this.imgsSelected.emit(this.selectedPhotos);
    this.preview.emit(this.selectedPhotos);
  }

  removeSelectedItems() {
    let el = $('.photo-box-img');
    if (el.hasClass('selected')) {
      el.removeClass('selected');
    }
    this.selectedPhotos = [];
  }

  onLoadMore(even: any) {
    this.loadMore.emit(even.first);
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
      if (this.selectedPhotos.length > 1) {
        this.selectedPhotos = [];
        parent.find('.photo-box-img').removeClass('selected');
        el.addClass('selected');
        this.selectedPhotos.push(id);
      } else {
        this.selectedPhotos = [];
        if (el.hasClass('selected')) {
          el.removeClass('selected');
        } else {
          parent.find('.photo-box-img').removeClass('selected');
          el.addClass('selected');
          this.selectedPhotos.push(id); // add
        }
      }
    } else {
      el.toggleClass('selected');
      if (_.indexOf(this.selectedPhotos, id) >= 0) {
        _.pull(this.selectedPhotos, id); // remove
      } else {
        this.selectedPhotos.push(id); // add
      }
    }

    console.log(this.selectedPhotos, this.selectedPhotos.length);

    this.imgsSelected.emit(this.selectedPhotos);
  }
}
