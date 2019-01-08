import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class WDataViewService {
  view$: any;
  private viewSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  selectedObjects$: Observable<any>;
  private selectedObjectsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor() {
    this.view$ = this.viewSubject.asObservable();
    this.selectedObjects$ = this.selectedObjectsSubject.asObservable().pipe(distinctUntilChanged());
  }

  changeView(view: string) {
    this.viewSubject.next(view);
  }
}

