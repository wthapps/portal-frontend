import { Component, Input } from '@angular/core';
import { Media } from '@shared/shared/models/media.model';
import { Observable } from 'rxjs/Observable';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';

@Component({
  selector: 'w-object-toolbar-view',
  template: `
    <div class="btn-group">
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
  `
})

export class WObjectToolbarViewComponent {
  @Input() data: Media;

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
}
