import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Observable ,  Subject } from 'rxjs';


@Injectable()
export class ContactSelectionService {
  onOpen$: Observable<any>;
  private onOpenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  onClose$: Observable<any>;
  private onCloseSubject: Subject<any> = new Subject<any>();

  onSelect$: Observable<any[]>;
  private onSelectSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    this.onOpen$ = this.onOpenSubject.asObservable();
    this.onClose$ = this.onCloseSubject.asObservable();
    this.onSelect$ = this.onSelectSubject.asObservable();
  }

  /**
   *
   * @param options
   */
  open(options: any) {
    this.onOpenSubject.next(options);
  }

  select(contacts: any) {
    this.onSelectSubject.next(contacts);
  }


  close() {
    const options = {};
    this.onCloseSubject.next(options);
    this.clear();
  }




  private clear() {
    this.onOpenSubject.next(null);
    this.onCloseSubject.next(null);
    this.onSelectSubject.next([]);
  }
}

