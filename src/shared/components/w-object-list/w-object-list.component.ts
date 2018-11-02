import {
  Component, Input, Output, ContentChild, TemplateRef, AfterViewInit,
  AfterContentChecked, ViewEncapsulation, EventEmitter, OnDestroy, OnChanges, SimpleChanges
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

export class WObjectListComponent implements OnDestroy, OnChanges, AfterContentChecked {
  @Input() data: Media[];
  @Input() sortInline: Boolean = true;
  @Input() scrollWindow: Boolean = false;
  @Input() isLoading: Boolean = false;
  @Input() viewMode = 'grid';
  @Output() completeLoadMore: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() completeSort: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() completeDoubleClick: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() selectedObjectsChanged: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() clickedItem: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() dbClickedItem: EventEmitter<any> = new EventEmitter<any>(null);

  @ContentChild('columnBox') columnBoxTmpl: TemplateRef<any>;
  @ContentChild('columnFileSize') columnFileSizeTmpl: TemplateRef<any>;
  @ContentChild('columnAction') columnActionTmpl: TemplateRef<any>;

  dragSelect: any;
  // view$: Observable<string>;
  selectedObjects: any;

  objectsDisabled: any;
  totalObjectsDisabled: Number = 0;

  hasScrollbar: boolean;
  hasMultipleSelection: Boolean = true;
  groupBy: string;
  sortBy: string;
  sortOrder: string;

  constructor(private objectListService: WObjectListService) {
    // this.view$ = this.objectListService.view$;

    this.objectListService.objectsDisabled$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.objectsDisabled = res);

    this.objectListService.selectedObjects$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => {
        this.selectedObjects = res;
        this.selectedObjectsChanged.emit(this.selectedObjects);
      });

    this.objectListService.groupBy$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.groupBy = res);

    this.objectListService.sortBy$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.sortBy = res);

    this.objectListService.sortOrder$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.sortOrder = res);

    this.objectListService.multipleSelection$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => this.hasMultipleSelection = res);

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.totalObjectsDisabled = 0;

    for (const object_type of this.objectsDisabled) {
      const totalObjectsDisabled = _.filter(this.data, (media: Media) => (media.object_type === object_type));
      this.totalObjectsDisabled = this.totalObjectsDisabled + totalObjectsDisabled.length;
    }
  }

  ngOnDestroy(): void {
    // this.objectListService.clear();
  }

  ngAfterContentChecked(): void {
    if (this.hasMultipleSelection) {
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
    } else {
      if (this.dragSelect) {
        this.dragSelect.stop();
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
    if (_.indexOf(this.objectsDisabled, item.object_type) >= 0 || _.indexOf(this.objectsDisabled, item.model) >= 0
     || !this.hasMultipleSelection) {
      this.objectListService.clear();
      this.objectListService.addItem(
        {
          id: item.id,
          object_type: item.object_type,
        }
      );
      this.completeDoubleClick.emit(item);
    } else {
      this.objectListService.addOrRemoveItem({
        id: item.id,
        object_type: item.object_type,
      });
    }
  }

  onSelectedAll() {
    this.objectListService.clear();
    _.map(this.data, (v: any) => {
      if (_.indexOf(this.objectsDisabled, v.object_type) === -1) {
        this.objectListService.addItem(
          {
            id: v.id,
            object_type: v.object_type,
          }
        );
      }
    });
  }

  onDoubleClick(item: any) {
    this.completeDoubleClick.emit(item);
    this.dbClickedItem.emit(item);
  }

  onClick(item: any) {
    if (_.indexOf(this.objectsDisabled, item.object_type) >= 0 || _.indexOf(this.objectsDisabled, item.model) >= 0
     || !this.hasMultipleSelection) {
      this.objectListService.clear();
      this.objectListService.addItem(
        {
          id: item.id,
          object_type: item.object_type,
        }
      );
      this.completeDoubleClick.emit(item);
      this.clickedItem.emit();
    }
    return false;
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
    }
    this.objectListService.setSortOrder(sortOrder);
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
    return (_.find(this.selectedObjects, {'id': item.id}) || item.selected);
  }

  isSelected(item: any) {
    return (_.indexOf(this.objectsDisabled, item.object_type) === -1);
  }
}
