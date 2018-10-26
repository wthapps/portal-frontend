import {
  Component, ViewEncapsulation, OnDestroy, ChangeDetectorRef, AfterViewInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

@Component({
  selector: 'w-object-toolbar-selected',
  template: `
    <div *ngIf="selectedObjects" class="wobject-selected-bar"
         [ngClass]="{active: selectedObjects?.length > 0}">
      <div class="wobject-selected-bar-content">
        <div class="wobject-selected-bar-left">
          <ul class="list-unstyled">
            <li class="divider">
              <button (click)="clearSelected()" class="btn btn-default" type="button">
                <i class="fa fa-times"></i>
              </button>
            </li>
            <li>
              <span class="btn btn-text">{{ selectedObjects?.length }} selected</span>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class WObjectToolbarSelectedComponent implements AfterViewInit, OnDestroy {
  @Input() selectedObjects: Media[];
  @Output() event: EventEmitter<any> = new EventEmitter<any>();


  constructor(private objectListService: WObjectListService,
              private cdr: ChangeDetectorRef
  ) {
  }

  clearSelected() {
    this.objectListService.clear();
    this.event.emit({action: 'close'});
  }

  ngAfterViewInit() {
    // this.cdr.detectChanges();
  }

  ngOnDestroy() {

  }
}
