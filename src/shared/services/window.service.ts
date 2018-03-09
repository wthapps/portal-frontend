import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WindowService {
  private storageSub= new Subject<boolean>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(payload: any) {
    this.storageSub.next(payload);
  }

  removeItem(payload: any) {
    this.storageSub.next(payload);
  }
}
