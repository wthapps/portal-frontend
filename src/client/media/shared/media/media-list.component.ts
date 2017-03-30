import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit, HostListener, ElementRef } from '@angular/core';
import { MediaObjectService } from '../container/media-object.service';

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
  @Input() selectedObjects: Array<any>;
  @Input() type: string = 'photo';
  @Input() data: Array<any> = new Array<any>();

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  public viewOption: string = 'grid';
  private pressingCtrlKey: boolean = false;


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    this.pressingCtrlKey = this.pressedCtrlKey(ke);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    this.pressingCtrlKey = this.pressedCtrlKey(ke);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {

    // if clicking on menu
    if ($(event.target).hasClass('fa')) return;

    // if clicking outside item
    if(this.elementRef.nativeElement.contains(event.target)) return;

    if (this.selectedObjects.length > 0) {
      _.forEach(this.selectedObjects, (item: any) => {
        if (_.some(this.selectedObjects, ['id', item.id])) {
          $('#photo-box-img-' + item.id).removeClass('selected');
        }
      });

      // remove all selected objects
      this.selectedObjects.length = 0;
      this.onAction({action: 'deselect', params: {selectedObjects: this.selectedObjects}});
    }
  }


  constructor(private mediaObjectService: MediaObjectService, private elementRef: ElementRef) {

  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getObjects(null);
  }

  getObjects(options: any) {
    this.mediaObjectService.listPhoto(options).subscribe((response: any)=> {
      this.data = response.data;
    });
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

  actionSortbar() {

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
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true: false);
  }

}
