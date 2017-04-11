import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, HostListener, ElementRef } from '@angular/core';
import { MediaObjectService } from '../container/media-object.service';
import { Constants } from '../../../core/shared/config/constants';

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


  sliderViewNumber: number = Constants.mediaSliderViewNumber.default;

  public viewOption: string = 'grid';
  private objects: Array<any> = new Array<any>();
  private pressingCtrlKey: boolean = false;

  private currentPath:string; //photos, albums, videos, playlist, share-with-me, favourites
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


  constructor(private mediaObjectService: MediaObjectService, private elementRef: ElementRef) {

  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // this.getObjects(null);
  }

  getObjects(options?: any) {
    this.mediaObjectService.getObjects(this.currentPath, options).subscribe((response: any)=> {
      this.objects = response.data;
    });
  }

  updateArgs() {
    this.objectType = this.data.objectType;
    this.currentPath = this.data.currentPath;
    this.getObjects();
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
