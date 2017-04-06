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
  @Output() events: EventEmitter<any> = new EventEmitter<any>();
  selectedObjects: Array<any> = new Array<any>();

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
    console.log('changing::', changes);
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
