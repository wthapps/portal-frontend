import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { Constants } from '@wth/shared/constant';

@Component({
  selector: 'w-toolbar',
  exportAs: 'wToolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})

export class WToolbarComponent {
  @Input() leftActionsTemplate: TemplateRef<any>;
  @Input() objectActionsTemplate: TemplateRef<any>;
  @Input() moreActionsTemplate: TemplateRef<any>;

  @Input() selectedObjects: Array<any> = new Array<any>();
  @Input() view;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';
  favorited: boolean = true;
  tooltip: any = Constants.tooltip;

  constructor() {
  }

  doAction(event: any) {
    if (event.action === 'favourite' && event.payload.mode === 'add') {
      event.payload.selectedObjects.forEach(object => object.favorite = true);
    } else if (event.action === 'favourite' && event.payload.mode === 'remove') {
      event.payload.selectedObjects.forEach(object => object.favorite = true);
    }
    this.event.emit(event);
  }

  // favourited() {
  //   let result = true;
  //   this.selectedObjects.forEach(object => {
  //     if (!object.favourite) {
  //       result = false;
  //       return;
  //     }
  //   });
  //   return result;
  // }

  checkFavorite(): boolean {
    this.selectedObjects.forEach(object => {
      if (!!object.favorite) {
        this.favorited = false;
        return false;
      }
    });
    this.favorited = true;
    return true;
  }
}
