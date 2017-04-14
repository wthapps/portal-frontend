import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, HostListener, ElementRef } from '@angular/core';
import { MediaObjectService } from '../container/media-object.service';
import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'me-list',
  templateUrl: 'media-list.component.html',
  styleUrls: ['media-list.component.css'],
  providers: [
    MediaObjectService
  ]
})

export class MediaListComponent implements OnInit, AfterViewInit {
  @Input() selectedObjects: Array<any> = new Array<any>();
  @Input() type: string = 'photo';
  @Input() data: any;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  readonly LIST_TYPE = { photo: 'photo', album: 'album', mix: 'mix'};
  readonly TYPE_MAPPING: any = Constants.mediaListDetailTypeMapping;

  sliderViewNumber: number = Constants.mediaSliderViewNumber.default;
  viewOption: string = 'grid';

  groupBy: string;
  objects: Array<any> = new Array<any>();
  currentPath: string; //photos, albums, videos, playlist, share-with-me, favourites
  nextLink: string;
  private pressingCtrlKey: boolean = false;

  private currentPage: string;
  private objectType: string; //photo, album, video, playlist, all



  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    this.pressingCtrlKey = this.pressedCtrlKey(ke);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    this.pressingCtrlKey = this.pressedCtrlKey(ke);
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event: any) {
  //
  //   // if clicking on menu
  //   if ($(event.target).hasClass('fa')) return;
  //
  //   // if clicking outside item
  //   if(this.elementRef.nativeElement.contains(event.target)) return;
  //
  //   if (this.selectedObjects.length > 0) {
  //     _.forEach(this.selectedObjects, (item: any) => {
  //       if (_.some(this.selectedObjects, ['id', item.id])) {
  //         $('#photo-box-img-' + item.id).removeClass('selected');
  //       }
  //     });
  //
  //     // remove all selected objects
  //     this.selectedObjects.length = 0;
  //     this.onAction({action: 'deselect', params: {selectedObjects: this.selectedObjects}});
  //   }
  // }


  constructor(
    private mediaObjectService: MediaObjectService,
    private elementRef: ElementRef,
    private loadingService: LoadingService
  ) {

  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getObjects();

  }

  getObjects(options?: any) {
    this.loadingService.start('#list-photo');
    this.mediaObjectService.getObjects(this.currentPath, options).subscribe((response: any)=> {
      this.loadingService.stop('#list-photo');
      this.objects = response.data;
      this.nextLink = response.page_metadata.links.next;

    });
  }

  getMoreObjects() {
    // this.loadingService.start('#list-photo');
    if (this.nextLink != null) { // if there are more objects
      this.mediaObjectService.getObjects(this.nextLink).subscribe((response: any)=> {
        // this.loadingService.stop('#list-photo');
        this.objects.push(response.data);
        this.nextLink = response.page_metadata.links.next;
      });
    }

  }

  initProperties(properties: any) {
    this.objectType = properties.objectType;
    this.currentPath = properties.currentPath;
    this.currentPage = properties.currentPage;
  }


  onDragenter(e: any) {
    e.preventDefault();
    // if (!this.selectablesEnable) {
    //   this.selectables.enable();
    // }
  }

  onDragleave(e: any) {
    e.preventDefault();
    // this.selectablesEnable = false;
  }

  onAction(options: any) {
    if (options.action == 'select') {
      this.selectObject(options.params.selectedObject);
      options = {action: 'select', params: {selectedObjects: this.selectedObjects}};
    }
    this.events.emit(options);
  }

  changeView(viewOption: string) {
    this.viewOption = viewOption;
  }

  actionSortbar(event: any) {
    if (event.action == 'slider') {
      this.sliderViewNumber = event.number;
    }
  }

  actionItem(ev: any) {
    if (ev.action == 'group') {
      this.groupBy = ev.data;
        return;
    }
    this.events.emit(ev);
  }


  private selectObject(item: any): void {

    if (this.pressingCtrlKey) {
      if (_.some(this.selectedObjects, ['id', item.id])) {
        $('#photo-box-img-' + item.id).removeClass('selected');
        _.remove(this.selectedObjects, ['id', item.id]);
      } else {
        $('#photo-box-img-' + item.id).addClass('selected');
        this.selectedObjects.push(item);
      }
    } else {
      $('.row-img .photo-box-img').removeClass('selected');
      $('#photo-box-img-' + item.id).addClass('selected');
      this.selectedObjects.length = 0;
      this.selectedObjects.push(item);
    }
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

}
