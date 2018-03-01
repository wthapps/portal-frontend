import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare let _: any;

@Injectable()
export class WMediaListService {
  view$: any;
  private viewSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  constructor() {
    this.view$ = this.viewSubject.asObservable();
  }

  changeView(view: string) {
    this.viewSubject.next(view);
  }
}

