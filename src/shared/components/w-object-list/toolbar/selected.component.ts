import { Component, ViewEncapsulation, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

@Component({
  selector: 'w-object-toolbar-selected',
  template: `
    <div *ngIf="(selectedObjects$ | async)" class="wobject-selected-bar"
         [ngClass]="{active: (selectedObjects$ | async)?.length > 0}">
      <div class="wobject-selected-bar-content">
        <div class="wobject-selected-bar-left">
          <ul class="list-unstyled">
            <li class="divider">
              <button (click)="clearSelected()" class="btn btn-default" type="button">
                <i class="fa fa-times"></i>
              </button>
            </li>
            <li>
              <span class="btn btn-text">{{ (selectedObjects$ | async)?.length }} selected</span>
            </li>
          </ul>

        </div>
        <div class="wobject-selected-bar-right">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['selected.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WObjectToolbarSelectedComponent implements AfterViewInit, OnDestroy {
  selectedObjects$: Observable<Media[]>;

  constructor(private objectListService: WObjectListService,
              private cdr: ChangeDetectorRef
  ) {
    this.selectedObjects$ = this.objectListService.selectedObjects$;
  }

  clearSelected() {
    this.objectListService.clear();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {

  }
}
