import {
  Component, Input, EventEmitter, Output, ViewChild, OnInit, AfterViewInit, SimpleChanges,
  OnChanges
} from '@angular/core';
import { Location } from '@angular/common';
import { ViewOptions } from './view-options.constant';
import { Observable, Observer } from 'rxjs';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'me-toolbar-list',
  templateUrl: 'media-toolbar-list.component.html',
  styleUrls: ['media-toolbar-list.component.css']
})

export class MediaToolbarListComponent implements OnInit, AfterViewInit {
  @Input() currentPage: string; //photo_list, albumlist, object_list, photo_detail, album_detail, object_detail
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  selectedObjects: Array<any> = new Array<any>();
  data: any;

  object: any;


  currentPath: string;
  objectType: string;

  noSelectedObjects: boolean = true;
  viewOption: string = 'grid';
  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';

  // if all of objects are favourite or not
  isFavourited: boolean = false;
  hasMultiObjects: boolean = false;


  constructor() {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  initProperties(properties: any) {
    this.objectType = properties.objectType;
    this.currentPath = properties.currentPath;
    this.currentPage = properties.currentPage;
    console.log('current page: ', this.currentPage);
  }


  onAction(options: any) {
    if(_.get(options, 'action', '') == 'changeView') {
      this.viewOption = options.params.viewOption;
    }
    // toggle favourite action
    if (options.action == 'favourite') {
      this.isFavourited = !this.isFavourited;
    }
    this.events.emit(options);
  }

  updateProperties(properties: any) {
    if(properties.hasOwnProperty('selectedObjects')) {
      this.selectedObjects = properties.selectedObjects;
    }
    if (properties.hasOwnProperty('object')) {
      this.object = properties.object;
    }
    this.noSelectedObjects = this.selectedObjects.length > 0 ? false: true;

    this.isFavourited = !_.some(this.selectedObjects, ['favorite', false]);
    this.hasMultiObjects = this.selectedObjects.length > 1 ? true : false;
  }
}
