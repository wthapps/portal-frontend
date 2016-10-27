import { EventEmitter } from '@angular/core';

export interface MenuItemBreadcrumb {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  eventEmitter?: EventEmitter<any>;
  items?: MenuItemBreadcrumb[];
}
