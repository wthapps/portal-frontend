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

  @Input() object; // detail object
  @Input() selectedObjects: Array<any> = new Array<any>();
  @Input() view;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';
  favoriteAll: boolean = false;
  hasOneObject: boolean = false;
  hasManyObjects: boolean = false;
  hasNoObject: boolean = false;

  tooltip: any = Constants.tooltip;

  constructor() {
  }

  doAction(event: any) {
    if (event.action === 'favourite') {
      event.payload.selectedObjects.map(object => object.favorite = event.payload.mode === 'add' ? true : false);
      this.updateSelectedObjects(event.payload.selectedObjects);
    }
    if (event.action === 'deselectAll') {
      console.log('deselectAll:::');
      this.selectedObjects.length = 0;
      this.updateSelectedObjects([]);
    }
    this.event.emit(event);
  }

  updateSelectedObjects(objects: Array<any>) {
    this.selectedObjects = objects;
    this.favoriteAll = this.checkFavoriteAll(this.selectedObjects);
    this.hasManyObjects = this.selectedObjects.length > 1 ? true : false;
    this.hasOneObject = this.selectedObjects.length === 1 ? true : false;
    this.hasNoObject = this.selectedObjects.length === 0 ? true : false;
  }

  private checkFavoriteAll(objects: Array<any>): boolean {
    let result = true;
    objects.forEach(object => {
      if (object.favorite === false) {
        result = false;
        return;
      }
    });
    return result;
  }
}
