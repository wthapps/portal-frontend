import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  OnDestroy,
  ViewEncapsulation,
  ContentChild,
  TemplateRef, OnChanges, SimpleChanges
} from '@angular/core';

import { Subject } from 'rxjs';


import { Constants } from '@wth/shared/constant';
import { LocalStorageService } from 'angular-2-local-storage';

declare var _: any;
declare var $: any;

@Component({
  // encapsulation: ViewEncapsulation.None,
  selector: 'w-grid-list',
  templateUrl: 'grid-list.component.html',
  styleUrls: ['grid-list.component.scss']
})

export class WGridListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() leftActionsTemplate: TemplateRef<any>;
  @Input() objectActionsTemplate: TemplateRef<any>;
  @Input() moreActionsTemplate: TemplateRef<any>;
  @Input() girdItemTemplate: TemplateRef<any>;
  @Input() scrollWindow: Boolean = true;
  @Input() hideScale: Boolean = false;
  @Input() viewSize: number = Constants.mediaSliderViewNumber.default;
  @Input() sorting: any = { sort_name: 'Date', sort: 'desc' };

  @Input() view: string = 'grid';
  @Input() objects: Array<any> = new Array<any>();
  @Input() nextLink: string = null;
  @Input() hasMultipleSelection: boolean = true;
  @Input() title: string;
  @Input() titleActions: Array<any> = [];
  @Input() filters: Array<any> = [];

  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedObjectsChanged: EventEmitter<any> = new EventEmitter<any>();

  selectedObjects: Array<any> = [];

  groupByTime: string = 'date';
  // this is used in detail pages
  object: any;
  page: string;

  @ContentChild('columnBox') columnBoxTmpl: TemplateRef<any>;
  @ContentChild('columnFileSize') columnFileSizeTmpl: TemplateRef<any>;
  @ContentChild('columnAction') columnActionTmpl: TemplateRef<any>;

  dragSelect: any;

  objectsDisabled: any;
  totalObjectsDisabled: Number = 0;

  hasScrollbar: boolean;
  field: any;
  direction: any;
  groupBy = 'Date';
  sliderVal: number = Constants.mediaSliderViewNumber.default;
  sliderMin: number = Constants.mediaSliderViewNumber.min;
  sliderMax: number = Constants.mediaSliderViewNumber.max;

  private pressingCtrlKey: boolean = false;
  private destroySubject: Subject<any> = new Subject<any>();

  /**
   *
   */
  constructor(private localStorageService: LocalStorageService) {
    this.sliderVal = localStorageService.get('media_slider_val') || Constants.mediaSliderViewNumber.default;
  }

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
    if (ke.keyCode === 27) {
      this.deSelectAll();
    }
  }

  ngOnInit() {
    this.viewSize = this.localStorageService.get('media_slider_val') || Constants.mediaSliderViewNumber.default;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.view) {
      this.view = changes.view.currentValue;
      if (this.view === 'grid') {
        this.groupByTime = '';
        this.groupBy = 'object_type';
      }
      if (this.view === 'list') {
        this.groupByTime = '';
        this.groupBy = '';
      }

      if (this.view === 'timeline') {
        this.groupByTime = 'date';
        this.groupBy = 'created_at_converted';
      }
    }
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();    // Destroy unused subscriptions
  }

  onDragenter(e: any) {
    e.preventDefault();
  }

  onDragleave(e: any) {
    e.preventDefault();
    // this.selectablesEnable = false;
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'changeView':
        this.changeView(event.payload.view, event.payload.groupBy);
        break;
      case 'zoom':
        this.zoom(event.payload);
        break;
      default:
        if (event.action === 'sort') {
          this.sorting.sort_name = event.payload.queryParams.sort_name;
          this.sorting.sort = event.payload.queryParams.sort;
        }
        if (event.action == 'clickOnCircle' || event.action == 'clickOnItem') {
          if ((this.pressingCtrlKey || event.action == 'clickOnCircle') && this.hasMultipleSelection) {
            this.toggleObject(event.payload.object);
          } else {
            this.deSelectAll();
            this.selectObject(event.payload.object);
          }
        }
        this.event.emit(event);
        break;
    }
  }

  changeFilter(data: any){
    this.event.emit({action: 'filter', data: data});
  }

  zoom(event: any) {
    this.sliderVal = event.value;
    this.localStorageService.set('media_slider_val', this.sliderVal);
    this.viewSize = this.sliderVal;
  }

  changeView(view: string, groupBy: string) {
    this.view = view;
    groupBy = groupBy.toLowerCase();
    if (this.view === 'grid') {
      this.groupByTime = '';
      this.groupBy = 'object_type';
    }
    if (this.view === 'list') {
      this.groupByTime = '';
      this.groupBy = '';
    }

    if (this.view === 'timeline') {
      this.groupByTime = groupBy || 'date';
      this.groupBy = 'created_at_converted';
    }
  }


  sort(field: string, groupBy: string = '') {
    if (field === this.sorting.sort_name) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    }

    if (field === 'Date' || field === 'Month' || field === 'Year') {
      this.sorting.sort_name = 'created_at';
      this.sorting.sort = this.direction;
      this.event.emit({ action: 'sort', payload: { queryParams: { sort: this.sorting.sort, sort_name: 'created_at' } } });
    } else {
      this.sorting.sort_name = field;
      this.sorting.sort = this.direction;
      this.event.emit({
        action: 'sort',
        payload: { queryParams: { sort: this.direction, sort_name: this.sorting.sort_name } }
      });
    }
  }

  onDragSelected(data: any) {

  }

  private deSelectAll() {
    this.objects.forEach(ob => {
      ob.selected = false;
    })
  }

  private selectObject(object: any) {
    this.objects.forEach(ob => {
      if (ob.id == object.id && ob.object_type == object.object_type) {
        ob.selected = true;
      }
    })
  }

  private toggleObject(object) {
    this.objects.forEach(ob => {
      if (ob.id == object.id && ob.object_type == object.object_type ) {
        ob.selected = !ob.selected;
      }
    })
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode === 17 || ke.keyCode === 18 || ke.keyCode === 91 || ke.keyCode === 93 || ke.ctrlKey) ? true : false);
  }
}
