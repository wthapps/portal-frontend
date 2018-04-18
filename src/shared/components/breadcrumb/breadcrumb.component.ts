import { Component, Input, OnDestroy, EventEmitter, Output, OnInit } from '@angular/core';
import { NoteBreadcrumb } from './breadcrumb';
import { Router } from '@angular/router';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'z-shared-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['breadcrumb.component.scss']
})
export class ZSharedBreadcrumbComponent implements OnInit, OnDestroy {

  @Input() models: NoteBreadcrumb[];

  @Input() style: any;

  @Input() styleClass: string;

  @Output() onBreadcrumbAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) {
  }

  ngOnInit() {
    // console.log(this.models);
  }

  itemClick(event: any, item: NoteBreadcrumb) {
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

  onClick(item: any) {
    if (item) this.router.navigate([item.routerLink]);
  }

  onMenu(event: string) {
    this.onBreadcrumbAction.emit(event);
  }

  ngOnDestroy() {
    if (this.models) {
      for (let item of this.models) {
        if (item.eventEmitter) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }

}
