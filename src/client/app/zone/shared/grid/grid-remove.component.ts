import {
  Component, Input, EventEmitter, Output, HostListener
} from '@angular/core';

import { ZPictureGridComponent } from './grid.component';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-remove-gridview',
  templateUrl: 'grid.component.html'
})

export class ZPictureGridRemoveComponent extends ZPictureGridComponent {
  @Input() items: any;
  @Output() addItems: EventEmitter<any> = new EventEmitter<any>();

  keyCtrl: boolean = false;
  reset: boolean;
  allItems: any = [];

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = false;
    }
  }


  constructor() {
    super();
  }

  onSelected(e: any, id: number) {
    let parent = $(e.target).parents('.row-img');
    let el = $(e.target).parents('.photo-box-img');

    if (!this.keyCtrl) {
      if (this.selectedPhotos.length > 1) {
        this.selectedPhotos = [];
        parent.find('.photo-box-img').removeClass('removed');
        el.addClass('removed');
        this.selectedPhotos.push(id);
      } else {
        this.selectedPhotos = [];
        if (el.hasClass('removed')) {
          el.removeClass('removed');
        } else {
          parent.find('.photo-box-img').removeClass('removed');
          el.addClass('removed');
          this.selectedPhotos.push(id); // add
        }
      }
    } else {
      el.toggleClass('removed');
      if (_.indexOf(this.selectedPhotos, id) >= 0) {
        _.pull(this.selectedPhotos, id); // remove
      } else {
        this.selectedPhotos.push(id); // add
      }
    }
    // console.log(this.items, this.selectedPhotos);
    // this.imgsSelected.emit(this.selectedPhotos);
    this.filterItemRemove(this.selectedPhotos);
  }

  filterItemRemove(selectedPhotos: any) {
    this.allItems = [];
    _.map(this.items, (v: any) => {
      this.allItems.push(v.id);
    });
    let remainItems = _.pullAll(this.allItems, selectedPhotos);
    this.addItems.emit(remainItems);
  }
}
