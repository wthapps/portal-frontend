import { Component, Input, OnDestroy, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { NoteBreadcrumb } from './breadcrumb';
import { Router } from '@angular/router';

@Component({
  selector: 'z-shared-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZSharedBreadcrumbComponent implements OnInit, OnDestroy {

  @Input() models: NoteBreadcrumb[];

  @Input() style: any;

  @Input() styleClass: string;

  @Output() onBreadcrumbAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router) {}

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
    this.onBreadcrumbAction.emit({action: 'click', payload: item});
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
