/**
 * <wth-breadcrumb [model]="breadcrumbs"></wth-breadcrumb>
 */

import { Component, Input, OnDestroy, EventEmitter } from '@angular/core';
import { MenuItemBreadcrumb } from './breadcrumb';
import { Router } from '@angular/router';

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
    `
})
export class BreadcrumbComponent implements OnDestroy {

  @Input() model: MenuItemBreadcrumb[];

  @Input() style: any;

  @Input() styleClass: string;

  constructor(private router: Router) {
  }

  itemClick(event: any, item: MenuItemBreadcrumb) {
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
