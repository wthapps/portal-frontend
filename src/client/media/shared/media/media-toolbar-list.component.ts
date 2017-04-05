import { Component, Input, EventEmitter, Output, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ViewOptions } from './view-options.constant';

@Component({
  moduleId: module.id,
  selector: 'me-toolbar-list',
  templateUrl: 'media-toolbar-list.component.html'
})

export class MediaToolbarListComponent implements OnInit, AfterViewInit {
  @Input() data: any;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  private viewOption: string = 'grid';
  private grid: string = 'grid';
  private list: string = 'list';
  private timeline: string = 'timeline';

  constructor() {

  }


  ngOnInit(): void {
    console.log('init toolbar', this.data);
  }

  ngAfterViewInit(): void {
    console.log('after view init toolbar', this.data);
  }

  onAction(options: any) {
    event.preventDefault();

    if(options.action == 'changeView') {
      this.viewOption = options.params.viewOption;
    }
    this.events.emit(options);
  }
}
