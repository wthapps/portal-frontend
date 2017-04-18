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


  noSelectedObjects: boolean = true;
  viewOption: string = 'grid';
  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';
  hasFavourite: boolean = false;
  private currentPath: string;
  private objectType: string;




  constructor() {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  // ngOnChanges(changes: SimpleChanges) {
  //
  // }

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
    this.events.emit(options);
  }

  updateAttributes(attbutes: any) {
    this.selectedObjects = attbutes.selectedObjects;
    this.noSelectedObjects = this.selectedObjects.length > 0 ? false: true;
  }


}
