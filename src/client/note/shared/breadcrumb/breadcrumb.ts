import { EventEmitter } from '@angular/core';

export interface NoteBreadcrumb {
  label?: string;
  id?: string;
  name?: string;
  object_type?: string;
  parent_id?: number;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  eventEmitter?: EventEmitter<any>;
  items?: NoteBreadcrumb[];
}
