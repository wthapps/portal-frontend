import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Photo } from '../../../shared/models/photo.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-listview',
  templateUrl: 'list.component.html',
  host: {
    '(document:keydown)': 'onDocumentKeyDown($event)',
    '(document:keyup)': 'onDocumentKeyUp($event)'
  }
})

export class ZPictureListComponent implements OnChanges {
  @Input() data: Array<any>;
  @Output() imgDetail: EventEmitter<number> = new EventEmitter<number>();
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  dataPhotos: Array<Photo> = [];
  selectedPhotos: Array<any> = [];

  keyCtrl: boolean = false;

  sortName: any = false;
  sortDate: any = false;

  onDocumentKeyDown(ev: KeyboardEvent) {
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
    this.dataPhotos = this.data;
  }

  onDbClick(id: any) {
    this.imgDetail.emit(id);
  }

  /**
   *
   * @param event
   * @param column
   */
  sort(event:any, column:any) {
    if (column == 'name') {
      this.sortName = (this.sortName == false || this.sortName == 'asc' ? 'desc' : 'asc');
      console.log(this.sortName, this.dataPhotos);
      this.dataPhotos = _.orderBy(this.dataPhotos, [column], [this.sortName]);
      console.log('after', this.dataPhotos);
      this.sortDate = false;
    } else {
      this.sortDate = (this.sortDate == false || this.sortDate == 'asc' ? 'desc' : 'asc');
      this.dataPhotos = _.orderBy(this.dataPhotos, [column], [this.sortDate]);
      this.sortName = false;
    }
  }

  /**
   *
   * @param e
   * @param id of Image
   */
  onSelected(e: any, id: number) {
    let parent = $(e.target).parents('.row-img');
    //let el = $(e.target).parents('.photo-box-img');
    let el = $(e.target);

    if (!this.keyCtrl) {
      this.selectedPhotos = [];
      if (el.hasClass('selected')) {
        el.removeClass('selected');
      } else {
        parent.find('.photo-box-img').removeClass('selected');
        el.addClass('selected');
        this.selectedPhotos.push(id); // add
      }
    } else {
      el.toggleClass('selected');
      if (_.indexOf(this.selectedPhotos, id) >= 0) {
        _.pull(this.selectedPhotos, id); // remove
      } else {
        this.selectedPhotos.push(id); // add
      }
    }
    this.imgsSelected.emit(this.selectedPhotos);
  }

}
