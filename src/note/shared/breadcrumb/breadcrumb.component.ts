import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NoteBreadcrumb} from './breadcrumb';
import {Router} from '@angular/router';

@Component({
  selector: 'z-note-shared-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  styleUrls: ['breadcrumb.component.scss']
})
export class ZNoteSharedBreadcrumbComponent implements OnInit, OnDestroy {

  @Input() model: NoteBreadcrumb[];

  @Input() style: any;

  @Input() styleClass: string;

  @Output() onBreadcrumbAction: EventEmitter<any> = new EventEmitter<any>();

  @Input() permissions: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    // this.context$ = this.store.select(context.getContext);
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
    if (item) {
      this.router.navigate([item.routerLink]);
    }
  }

  onMenu(event: string) {
    this.onBreadcrumbAction.emit(event);
  }

  ngOnDestroy() {
    if (this.model) {
      for (const item of this.model) {
        if (item.eventEmitter) {
          item.eventEmitter.unsubscribe();
        }
      }
    }
  }

}
