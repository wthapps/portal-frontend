import { Component, Input } from '@angular/core';
import { Media } from '@shared/shared/models/media.model';
import { WMediaListService } from '@shared/components/w-media-list/w-media-list.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'w-media-toolbar-view',
  template: `
    <div class="btn-group">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
        <i *ngIf="(view$ | async) == 'grid'" class="fa fa-th-large"></i>
        <i *ngIf="(view$ | async) == 'list'" class="fa fa-th-list"></i>
        <i *ngIf="(view$ | async) == 'timeline'" class="fa fa-align-left"></i>
      </button>
      <ul class="dropdown-menu">
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

export class WMediaToolbarViewComponent {
  @Input() data: Media;

  view$: Observable<string>;

  constructor(private mediaListService: WMediaListService) {
    this.view$ = this.mediaListService.view$;
  }

  onChangeView(view: string) {
    this.mediaListService.changeView(view);
  }
}
