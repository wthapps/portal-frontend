import {
  Component, Input, EventEmitter, Output, ViewChild, OnInit, AfterViewInit, SimpleChanges,
  OnChanges, ViewContainerRef
} from '@angular/core';
import { Location } from '@angular/common';
import { ViewOptions } from './view-options.constant';
import { Observable, Observer } from 'rxjs';
import { MediaUploaderComponent } from '../uploader/media-uploader.component';

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

  @ViewChild('uploader') uploader: MediaUploaderComponent;

  selectedObjects: Array<any> = new Array<any>();
  object: any;


  currentPath: string;
  objectType: string;
  page: string;

  noSelectedObjects: boolean = true;
  viewOption: string = 'grid';
  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';

  // if all of objects are favourite or not
  isFavourited: boolean = false;
  hasMultiObjects: boolean = false;
  favouriteTooltip: string = 'Add to favourites';

  displayCreateButtons: boolean = true;
  displayBackButton: boolean = false;


  constructor() {

  }

  ngOnInit(): void {
    this.displayCreateButtons = (this.page == 'search' || this.page == 'album_detail' ? false : true);
    this.displayBackButton = (this.page == 'search' || this.page == 'album_detail' ? true : false);
  }

  ngAfterViewInit(): void {
  }

  initProperties(properties: any) {
    this.objectType = properties.objectType;
    this.currentPath = properties.currentPath;
    this.currentPage = properties.currentPage;
    this.page = properties.page;
  }


  onAction(options: any) {
    if(_.get(options, 'action', '') == 'changeView') {
      this.viewOption = options.params.viewOption;
    }
    // toggle favourite action
    if (options.action == 'favourite') {
      this.isFavourited = !this.isFavourited;
      this.favouriteTooltip = this.isFavourited ? 'Remove from favourites' : 'Add to favourites';

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
    this.favouriteTooltip = this.isFavourited ? 'Remove from favourites' : 'Add to favourites';
  }
}
