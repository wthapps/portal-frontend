import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { MediaObjectService } from '../container/media-object.service';
import { Observer, Observable } from 'rxjs';

declare var Selectables: any;

@Component({
  moduleId: module.id,
  selector: 'me-list',
  templateUrl: 'media-list.component.html',
  providers: [
    MediaObjectService
  ]
})
export class MediaListComponent implements OnInit, AfterViewInit {
  @Input() selectedObjects: Array<any>;
  @Input() type: string = 'photo';
  @Input() data: Array<any> = new Array<any>();

  @Output() events: EventEmitter<any> = new EventEmitter<any>();


  view: string = 'grid';


  constructor(private mediaObjectService: MediaObjectService) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    console.log('load photo list of object');
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
    this.events.emit(options);
  }

  changeView(options: any) {
    console.log('changing view: ', options);
  }
  // actionSortbar(ev: any) {
  //   this.data = ev;
  // }
}
