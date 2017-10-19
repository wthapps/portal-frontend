import { EventEmitter } from '@angular/core';

export interface NoteBreadcrumb {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  eventEmitter?: EventEmitter<any>;
  items?: NoteBreadcrumb[];
}
