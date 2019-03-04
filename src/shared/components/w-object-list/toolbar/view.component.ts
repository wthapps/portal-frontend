import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Media } from '@shared/shared/models/media.model';
import { Observable } from 'rxjs';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';

@Component({
  selector: 'w-object-toolbar-view',
  template: `
    <div class="btn-group" *ngIf="changeViewEnable">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
        <i *ngIf="(view$ | async) == 'grid'" class="fa fa-th-large"></i>
        <i *ngIf="(view$ | async) == 'list'" class="fa fa-th-list"></i>
        <i *ngIf="(view$ | async) == 'timeline'" class="fa fa-align-left"></i>
      </button>
      <ul class="dropdown-menu dropdown-menu-right">
        <li>
          <a (click)="onChangeView('grid')" href="javascript:;">
            <i class="fa fa-th-large"></i> Grid
          </a>
        </li>
        <li>
          <a (click)="onChangeView('list')" href="javascript:;">
            <i class="fa fa-th-list"></i> List
          </a>
        </li>
        <li>
          <a (click)="onChangeView('timeline')" href="javascript:;">
            <i class="fa fa-align-left"></i> Timeline
          </a>
        </li>
      </ul>
    </div>
    <div *ngIf="sortEnable">
      <span class="btn btn-text pull-right" (click)="sort(field)" style="cursor: pointer;">
        <i class="fa" [ngClass]="{'fa-arrow-up': (direction == 'asc'), 'fa-arrow-down': (direction == 'desc')}"></i>
      </span>

      <div class="dropdown pull-right">
        <span class="btn btn-text dropdown-toggle" style="cursor: pointer;" type="button" data-toggle="dropdown">
          {{ field ==='created_at' ? 'Date': field }}
        </span>
        <ul class="dropdown-menu dropdown-menu-right">
          <li><a (click)="sort('Date')" href="javascript:void(0);"> Date</a></li>
          <li><a (click)="sort('Name')" href="javascript:void(0);"> Name</a></li>
        </ul>
      </div>
    </div>
  `
})

export class WObjectToolbarViewComponent {
  @Input() data: Media;
  @Input() changeViewEnable = true;
  @Input() sortEnable = false;
  @Input() field = 'created_at';
  @Input() direction = 'desc';

  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  view$: Observable<string>;

  constructor(private objectListService: WObjectListService) {
    this.view$ = this.objectListService.view$;
  }

  onChangeView(view: string) {
    this.objectListService.changeView(view);
    if (view === 'timeline') {
      this.objectListService.setGroupBy('group_by_day');
      this.objectListService.setSortBy('created_at');
      this.objectListService.setSortOrder('desc');
    } else {
      this.objectListService.setGroupBy('object_type');
    }
  }

  sort(field: string, groupBy: string = '') {
    if (field === this.field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      // return;
    } else {
      this.field = field;
    }

    if (this.field === 'Date' || this.field === 'Month' || this.field === 'Year') {
      this.event.emit({action: 'sort', payload: {sort_direction: this.direction, sort_name: 'created_at'}});
      return;
    } else {
      this.event.emit({action: 'sort',
        payload: {sort_direction: this.direction, sort_name: this.field}});
    }
  }
}
