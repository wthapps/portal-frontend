import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { Location } from '@angular/common';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';


import { MediaObjectService } from '../../../media/shared/container/media-object.service';
import { ZMediaStore } from '../../../media/shared/store/media.store';
import { Constants } from '@wth/shared/constant';
import { LoadingService } from '@shared/shared/components/loading/loading.service';

declare var _: any;
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'w-grid-list',
  templateUrl: 'grid-list.component.html',
  styleUrls: ['grid-list.component.scss'],
  providers: [
    MediaObjectService
  ]
})

export class WGridListComponent implements OnInit, OnDestroy {
  selectedObjects: Array<any> = new Array<any>();

  @Input() viewOption: string = 'grid';
  @Input() currentPath: string = 'shared-by-me'; // photos, albums, videos, playlist, share-with-me, favourites
  @Input() objects: Array<any> = new Array<any>();


  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  sliderViewNumber: number = Constants.mediaSliderViewNumber.default;
  groupByTime: string = 'date';
  currentGroupByTime: string = 'date';
  groupBy: string = '';

  // this is used in list pages
  hasObjects: boolean = true;

  // this is used in detail pages
  object: any;
  page: string;

  nextLink: string;

  private pressingCtrlKey: boolean = false;

  private currentPage: string;
  private objectType: string; //photo, album, video, playlist, all
  private params: any;
  private currentView: number;
  private destroySubject: Subject<any> = new Subject<any>();


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = false;
    }

    //if pressing ESC key
    if (ke.keyCode == 27) {
      this.deSelectAll();
    }
  }

  constructor(protected loadingService: LoadingService,
              protected location: Location,
              protected mediaStore: ZMediaStore,
              protected cdr: ChangeDetectorRef,
              ) {


  }

  ngOnInit() {
    // set grid view mode is default
    this.changeView('grid');

  }

  ngOnDestroy() {
    this.currentView = 0;
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();    // Destroy unused subscriptions
  }

  getMoreObjects() {
    // this.loadingService.start('#list-photo');
    // if (this.nextLink != null) { // if there are more objects
    //   // this.mediaObjectService.getObjects(this.nextLink).subscribe((response: any)=> {
    //   this.mediaObjectService.loadMore(this.nextLink)
    //     .toPromise()
    //     .then((response: any)=> {
    //       // this.loadingService.stop('#list-photo');
    //       this.objects.push(...response.data);
    //       this.nextLink = response.page_metadata.links.next;
    //     });
    // }
  }

  initProperties(properties: any) {
    // this.objectType = properties.objectType;
    // this.currentPath = properties.currentPath;
    // this.currentPage = properties.currentPage;
    // this.params = properties.params;
  }

  onDragenter(e: any) {
    e.preventDefault();
  }

  onDragleave(e: any) {
    e.preventDefault();
    // this.selectablesEnable = false;
  }

  onEvent(event: any) {

    if (event.action === 'changeView') {
      this.changeView(event.payload.viewOption);
      return;
    }

    if (event.action === 'select') {
      this.selectObject(event.payload);
    }
    if (event.action === 'deselect') {
      this.selectObject(event.payload, false);
    }
    this.events.emit(event);
  }

  changeView(viewOption: string) {
    this.viewOption = viewOption;
    if (this.viewOption == 'grid') {
      this.groupByTime = '';
      this.groupBy = 'object_type';
    }
    if (this.viewOption == 'list') {
      this.groupByTime = '';
      this.groupBy = '';
    }
    if (this.viewOption == 'timeline') {
      this.groupByTime = this.currentGroupByTime;
      this.groupBy = 'created_at_converted';
    }
  }

  // sort(event: any) {
  //   if (event.action == 'slider') {
  //     this.sliderViewNumber = event.number;
  //   }
  //   if (event.action == 'sort') {
  //     this.sort(event.data);
  //   }
  //   if (event.action == 'group') {
  //     this.groupByTime = event.data;
  //     this.currentGroupByTime = this.groupByTime;
  //   }
  // }

  actionItem(ev: any) {
    this.events.emit(ev);
  }

  // considering moving doAction into list-media
  doAction(event: any) {
    console.log(event);
    switch (event.action) {
      case 'zoom':
        this.sliderViewNumber = event.number;
        break;
      case 'group':
        this.groupByTime = event.data;
        this.currentGroupByTime = this.groupByTime;
        break;
      case 'sort':
        this.sort(event.data);
        break;
      case 'showUploadedPhotos':
        this.showUploadedPhotos(event.payload.data);
        break;
      case 'share':
        this.share();
        break;
      case 'favourite':
        this.favourite(event.payload);
        break;
      case 'tag':
        this.tag();
        break;
      case 'showNewAlbum':
        this.showNewAlbum(event.data);
        break;
      case 'edit':
        this.edit();
        break;
      case 'editName':
        this.editName(event.payload.selectedObject);
        break;
      case 'editInfo':
        this.editInfo(event.payload.selectedObject);
        break;
      // Hide photos / albums present in shared-with-me screen
      case 'hideMedia':
        this.hideMedia(event.payload);
        break;
      case 'changeView':
        this.changeView(event.payload.viewOption);
        break;
      case 'preview':
      case 'previewAll':
        this.preview();
        break;
      case 'viewInfo':
      case 'viewDetails':

        // if (this.selectedObjects[0].object_type == 'sharing') {
        //   this.router.navigate([{outlets: {detail: ['shared-by-me', this.selectedObjects[0].id]}}], {
        //     queryParamsHandling: 'preserve',
        //     preserveFragment: true
        //   });
        // }
        break;
      case 'slideShow':
        this.slideShow();
        break;
      case 'changeCoverImage':
        this.changeCoverImage();
        break;

    }
  }


  preview() {
    return;
  }

  share() {
    return;
  }

  favourite(params: any) {

  }

  tag() {

    // this.modal.open();
    return;
  }

  edit() {

  }

  editName(selectedObject: any) {

  }

  editInfo(selectedObject: any) {

  }

  // Hide media present in shared with me screen
  hideMedia(params: any, callback?: any) {
    return;
  }

  viewDetails() {

  }

  slideShow() {
    return;
  }

  changeCoverImage() {
    return;
  }

  showNewAlbum(data?: any) {
    console.debug('show new album: ', data);
  }

  showUploadedPhotos(data?: any) {
    console.debug('showUploadedPhotos: ', data);
  }

  private refreshPrimaryList(): void {
  }

  private clearOutletsAndRefreshList(): void {
  }

  private selectAllPhotos() {
    // this.selectedObjects.length = 0;
    // this.selectedObjects.push(..._.filter(this.objects, ['object_type', 'photo']));
    // this.mediaStore.selectObjects(this.selectedObjects);
  }
 // mode = true is selecting
  private selectObject(payload: any, mode: boolean = true): void {
    this.selectedObjects = [];
    let item = payload.selectedObjects;
    if (this.pressingCtrlKey) {
      item.selected = !item.selected;
    } else {
      if(mode) {
        if (payload.checkbox !== true) {
          this.events.emit({action: 'deselectAll'});
        }
        item.selected = true;
      } else {
        item.selected = false;
      }
      this.selectedObjects.length = 0;
    }
    this.selectedObjects.push(item);
    payload.selectedObjects = this.selectedObjects;
  }

  private deSelectAll() {
      this.selectedObjects.length = 0;
      this.onEvent({action: 'deselectAll', payload: {}});
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

  private sort(data: any) {
    console.log(data);
    // this.getObjects(data);
  }
}
