import {
  Component, Input, Output, ContentChild, TemplateRef, AfterViewInit,
  AfterContentChecked, OnChanges, SimpleChanges, ViewEncapsulation, EventEmitter, OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import 'rxjs/add/operator/takeUntil';

import * as DragSelect from 'dragselect/dist/DragSelect.js';

import { WObjectListService } from './w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

declare let _: any;

@Component({
  selector: 'w-object-list',
  templateUrl: 'w-object-list.component.html',
  styleUrls: ['w-object-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WObjectListComponent implements OnChanges, OnDestroy, AfterViewInit, AfterContentChecked {
  @Input() data: Media[];
  @Input() sortInline: Boolean = true;
  @Output() completeLoadMore: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() completeSort: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() completeDoubleClick: EventEmitter<any> = new EventEmitter<any>(null);

  @ContentChild('columnBox') columnBoxTmpl: TemplateRef<any>;
  @ContentChild('columnFileSize') columnFileSizeTmpl: TemplateRef<any>;
  @ContentChild('columnAction') columnActionTmpl: TemplateRef<any>;

  dragSelect: any;
  view$: Observable<string>;
  selectedObjects: any;

  multipleSelection: boolean;

  hasScrollbar: boolean;
  groupBy: string;
  sortBy: string;
  sortOrder: string;

  constructor(private objectListService: WObjectListService) {
    this.view$ = this.objectListService.view$;

    this.objectListService.multipleSelection$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => {
        this.multipleSelection = res;
        if (this.dragSelect) {
          if (res) {
            this.dragSelect.start();
          } else {
            this.dragSelect.break();
          }
        }
      });

    this.objectListService.selectedObjects$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.selectedObjects = res);

    this.objectListService.groupBy$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.groupBy = res);

    this.objectListService.sortBy$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.sortBy = res);

    this.objectListService.sortOrder$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.sortOrder = res);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dragSelect && this.multipleSelection) {
      this.dragSelect.start();
    }
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    // if (this.multipleSelection) {
    //   this.dragSelect = new DragSelect({
    //     selectables: document.getElementsByClassName('wobject-drag'),
    //     area: document.getElementById('wobject-drag-body'),
    //     callback: e => this.onDragSelected(e)
    //   });
    // }
  }

  ngAfterContentChecked(): void {
    if (this.multipleSelection) {
      if (this.dragSelect) {
        this.dragSelect.start();
        this.dragSelect.addSelectables(document.getElementsByClassName('wobject-drag'));
      } else {
        this.dragSelect = new DragSelect({
          selectables: document.getElementsByClassName('wobject-drag'),
          area: document.getElementById('wobject-drag-body'),
          callback: e => this.onDragSelected(e)
        });
      }
    }


    const dragBodyScroll = document.getElementById('wobject-drag-body');
    if (dragBodyScroll) {
      this.hasScrollbar = (dragBodyScroll.scrollHeight > dragBodyScroll.clientHeight);
    }

  }

  onDragSelected(data: any) {
    if (data.length > 0) {
      this.objectListService.clear();
      _.map(data, (v: any) => {
        this.objectListService.addItem(
          {
            id: +v.dataset.id,
            object_type: v.dataset.type,
          }
        );
      });
    }
  }

  onMultiSelected(item: any) {
    this.objectListService.addOrRemoveItem({
      id: item.id,
      object_type: item.object_type,
    });
  }

  onSelectedAll() {
    this.objectListService.clear();
    _.map(this.data, (v: any) => {
      this.objectListService.addItem(
        {
          id: v.id,
          object_type: v.object_type,
        }
      );
    });
  }

  onDoubleClick(item: any) {
    this.completeDoubleClick.emit(item);
  }

  onCLick(item: any) {
    if (!this.multipleSelection) {
      this.completeDoubleClick.emit(item);
    } else {
      return false;
    }
  }

  onClearAll() {
    this.objectListService.clear();
  }

  onLoadMore() {
    this.completeLoadMore.emit(true);
  }

  onSort(sortBy: string) {
    let sortOrder = this.sortOrder;
    if (this.sortBy === sortBy) {
      sortOrder = (sortOrder === 'desc') ? 'asc' : 'desc';
      this.objectListService.setSortOrder(sortOrder);
    }
    this.objectListService.setSortBy(sortBy);

    if (!this.sortInline) {
      this.completeSort.emit({
        sortBy: sortBy,
        sortOrder: sortOrder,
      });
    }
  }

  onGroup(groupBy: string) {
    this.objectListService.setGroupBy(groupBy);
    if (!this.sortInline) {
      this.completeSort.emit({
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      });
    }
  }

  isActive(item: any) {
    return (_.find(this.selectedObjects, {'id': item.id}));
  }
}
