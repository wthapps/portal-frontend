import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Constants } from '@wth/shared/constant';

declare let _: any;

@Component({
  selector: 'me-toolbar',
  exportAs: 'meToolbar',
  templateUrl: 'media-toolbar.component.html',
  styleUrls: ['media-toolbar.component.scss']
})

export class MediaToolbarComponent implements OnInit {
  @Input() currentPage: string;
  @Input() selectedObjects: Array<any> = new Array<any>();

  @Input() objects: any;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();
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

  displayCreateButtons: boolean;
  displayBackButton: boolean = false;

  tooltip: any = Constants.tooltip;

  constructor() {
  }

  ngOnInit() {
    this.displayBackButton = (this.page == 'search' || this.page == 'album_detail' || this.page == 'sharing_detail' ? true : false);
    this.displayCreateButtons = !this.displayBackButton;
  }

  initProperties(properties: any) {
    this.objectType = properties.objectType;
    this.currentPath = properties.currentPath;
    this.currentPage = properties.currentPage;
    this.page = properties.page;
    this.object = properties.object;
  }


  onAction(options: any) {
    if (_.get(options, 'action', '') == 'changeView') {
      this.viewOption = options.payload.viewOption;
    }
    // toggle favourite action
    if (options.action == 'favourite') {
      this.isFavourited = !this.isFavourited;
      this.favouriteTooltip = this.isFavourited ? 'Remove from favourites' : 'Add to favourites';
    }
    this.events.emit(options);
  }

  updateProperties(properties: any) {
    if (properties.hasOwnProperty('selectedObjects')) {
      this.selectedObjects = properties.selectedObjects;
    }
    if (properties.hasOwnProperty('object')) {
      this.object = properties.object;
    }
    this.noSelectedObjects = this.selectedObjects.length > 0 ? false : true;

    this.isFavourited = !_.some(this.selectedObjects, ['favorite', false]);
    this.hasMultiObjects = this.selectedObjects.length > 1 ? true : false;
    this.favouriteTooltip = this.isFavourited ? 'Remove from favourites' : 'Add to favourites';
  }

  showUploadForm() {
    this.events.emit({action: 'openUploadModal'});
  }
}
