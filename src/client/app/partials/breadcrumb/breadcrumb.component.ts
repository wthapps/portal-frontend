/**
 * <wth-breadcrumb [model]="breadcrumbs"></wth-breadcrumb>
 */

import {Component, Input, OnDestroy, EventEmitter} from '@angular/core';
import {MenuItem} from './breadcrumb';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'wth-breadcrumb',
  template: `
    <div class="breadcrumb-wrap" [ngClass]="{styleClass:styleClass}" [ngStyle]="style">
      <ol class="breadcrumb">
        <li *ngFor="let item of model; let last = last;" [ngClass]="{'active': last}">
          <a *ngIf="!last" [routerLink]="[item.url||'/']">{{item.label}}</a>
          <span *ngIf="last">{{item.label}}</span>
        </li>
      </ol>
    </div>
    `,
  directives: [
    ROUTER_DIRECTIVES
  ]
})
export class BreadcrumbComponent implements OnDestroy {

  @Input() model: MenuItem[];

  @Input() style: any;

  @Input() styleClass: string;

  constructor(protected router: Router) {
  }

  itemClick(event, item: MenuItem) {
    if (!item.url || item.routerLink) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit(event);
    }

    if (item.routerLink) {
      this.router.navigate(item.routerLink);
    }
  }

  ngOnDestroy() {
    if (this.model) {
      for (let item of this.model) {
        if (item.eventEmitter) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }

}
