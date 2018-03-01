import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';

@Component({
  selector: 'w-object-toolbar-selected',
  template: `
    <div class="wobject-selected-bar" [ngClass]="{active: (selectedObjects$ | async).length > 0}">
      <div class="wobject-selected-bar-content">
        <div class="wobject-selected-bar-left">
          <ul class="list-unstyled">
            <li class="divider">
              <button (click)="clearSelected()" class="btn btn-default" type="button">
                <i class="fa fa-times"></i>
              </button>
            </li>
            <li>
              <span class="btn btn-text">{{ (selectedObjects$ | async).length }} selected</span>
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

export class WObjectToolbarSelectedComponent {
  selectedObjects$: Observable<string>;

  constructor(private objectListService: WObjectListService) {
    this.selectedObjects$ = this.objectListService.selectedObjects$;
  }

  clearSelected() {
    this.objectListService.clear();
  }
}
