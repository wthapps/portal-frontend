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
  TemplateRef
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';


import { Constants } from '@wth/shared/constant';

declare var _: any;
declare var $: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'w-grid-list',
  templateUrl: 'grid-list.component.html',
  styleUrls: ['grid-list.component.scss'],
  providers: [
  ]
})

export class WGridListComponent implements OnInit, OnDestroy {

  @Input() view: string = 'grid';
  @Input() objects: Array<any> = new Array<any>();

  @Input() currentPath: string = 'shared-by-me'; // photos, albums, videos, playlist, share-with-me, favourites

  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  selectedObjects: Array<any> = new Array<any>();

  viewSize: number = Constants.mediaSliderViewNumber.default;
  groupByTime: string = 'date';
  currentGroupByTime: string = 'date';
  // this is used in detail pages
  object: any;
  page: string;

  nextLink: string;


  @Input() data: Array<any>;
  @Input() sortInline: Boolean = true;
  @Output() completeLoadMore: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() completeSort: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() completeDoubleClick: EventEmitter<any> = new EventEmitter<any>(null);

  @ContentChild('columnBox') columnBoxTmpl: TemplateRef<any>;
  @ContentChild('columnFileSize') columnFileSizeTmpl: TemplateRef<any>;
  @ContentChild('columnAction') columnActionTmpl: TemplateRef<any>;

  dragSelect: any;

  objectsDisabled: any;
  totalObjectsDisabled: Number = 0;

  hasScrollbar: boolean;
  hasMultipleSelection: Boolean = true;
  groupBy: string = '';
  sortBy: string;
  sortOrder: string;




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
    if (ke.keyCode === 27) {
      this.deSelectAll();
    }
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.currentView = 0;
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
        this.changeView(event.payload.view);
        break;
      case 'zoom':
        this.zoom(event.payload);
        break;
      default:
        this.event.emit(event);
        break;
    }
  }

  zoom(payload: any) {
    this.viewSize = payload.viewSize;
  }

  changeView(view: string) {
    this.view = view;
    if (this.view === 'grid') {
      this.groupByTime = '';
      this.groupBy = 'object_type';
    }
    if (this.view === 'list') {
      this.groupByTime = '';
      this.groupBy = '';
    }
    if (this.view === 'timeline') {
      this.groupByTime = this.currentGroupByTime;
      this.groupBy = 'created_at_converted';
    }
  }






  isSelecting(item: any) {
    return (_.find(this.selectedObjects, {'id': item.id}));
  }

  isSelected(item: any) {
    return (_.indexOf(this.selectedObjects, item.object_type) === -1);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.totalObjectsDisabled = 0;
  //
  //   for (let object_type of this.objectsDisabled) {
  //     let totalObjectsDisabled = _.filter(this.data, (media: Media) => (media.object_type === object_type));
  //     this.totalObjectsDisabled = this.totalObjectsDisabled + totalObjectsDisabled.length;
  //   }
  // }


  // ngAfterContentChecked(): void {
  //   if (this.hasMultipleSelection) {
  //     if (this.dragSelect) {
  //       this.dragSelect.start();
  //       this.dragSelect.addSelectables(document.getElementsByClassName('wobject-drag'));
  //     } else {
  //       this.dragSelect = new DragSelect({
  //         selectables: document.getElementsByClassName('wobject-drag'),
  //         area: document.getElementById('wobject-drag-body'),
  //         callback: e => this.onDragSelected(e)
  //       });
  //     }
  //   } else {
  //     if (this.dragSelect) {
  //       this.dragSelect.stop();
  //     }
  //   }
  //
  //   const dragBodyScroll = document.getElementById('wobject-drag-body');
  //   if (dragBodyScroll) {
  //     this.hasScrollbar = (dragBodyScroll.scrollHeight > dragBodyScroll.clientHeight);
  //   }
  //
  // }

  onDragSelected(data: any) {

  }

  onMultiSelected(item: any) {
    if (_.indexOf(this.objectsDisabled, item.object_type) >= 0 || !this.hasMultipleSelection) {

      this.completeDoubleClick.emit(item);
    } else {

    }
  }

  onSelectedAll() {
    _.map(this.data, (v: any) => {
      if (_.indexOf(this.objectsDisabled, v.object_type) === -1) {

      }
    });
  }

  onDoubleClick(item: any) {
    this.completeDoubleClick.emit(item);
  }

  onClick(item: any) {
    if (_.indexOf(this.objectsDisabled, item.object_type) >= 0 || !this.hasMultipleSelection) {

      this.completeDoubleClick.emit(item);
    }
    return false;
  }

  onClearAll() {
  }

  onLoadMore() {
    console.log('onLoadMore');
    this.completeLoadMore.emit(true);
  }

  onSort(sortBy: string) {
    let sortOrder = this.sortOrder;
    if (this.sortBy === sortBy) {
      sortOrder = (sortOrder === 'desc') ? 'asc' : 'desc';
    }

    if (!this.sortInline) {
      this.completeSort.emit({
        sortBy: sortBy,
        sortOrder: sortOrder,
      });
    }
  }

  onGroup(groupBy: string) {
    if (!this.sortInline) {
      this.completeSort.emit({
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      });
    }
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
          this.event.emit({action: 'deselectAll'});
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
      this.doEvent({ action: 'deselectAll' });
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

  private sort(data: any) {
    console.log(data);
    // this.getObjects(data);
  }
}
