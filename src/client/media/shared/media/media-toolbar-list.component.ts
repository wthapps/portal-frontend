import {
  Component, Input, EventEmitter, Output, ViewChild, OnInit, AfterViewInit, SimpleChanges,
  OnChanges
} from '@angular/core';
import { Location } from '@angular/common';
import { ViewOptions } from './view-options.constant';
import { Observable, Observer } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'me-toolbar-list',
  templateUrl: 'media-toolbar-list.component.html'
})

export class MediaToolbarListComponent implements OnInit, AfterViewInit {
  data: any;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  selectedObjects: Array<any> = new Array<any>();

  private currentPath: string;
  private objectType: string;

  private noSelectedObjects: boolean = true;
  private viewOption: string = 'grid';
  private grid: string = 'grid';
  private list: string = 'list';
  private timeline: string = 'timeline';



  constructor() {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  updateArgs() {
    this.currentPath = this.data.currentPath;
    this.objectType = this.data.objectType;
  }

  onAction(options: any) {
    if(options.action == 'changeView') {
      this.viewOption = options.params.viewOption;
    }
    this.events.emit(options);
  }

  updateAttributes(attbutes: any) {
    console.log('selectedd objectsss', attbutes.selectedObjects);
    this.selectedObjects = attbutes.selectedObjects;

    this.noSelectedObjects = this.selectedObjects.length > 0 ? false: true;
  }
}
