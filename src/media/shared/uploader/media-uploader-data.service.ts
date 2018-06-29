/**
 * Created by anvo on 14/06/2017.
 */
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MediaUploaderDataService {
  showUp$: Observable<any>;
  action$: any;
  private showUpSource = new Subject<any>();
  private actionSource = new Subject<string>();

  constructor() {
    this.showUp$ = this.showUpSource.asObservable();
    this.action$ = this.actionSource.asObservable();
  }

  onShowUp() {
    this.showUpSource.next('');
  }

  onAction(options: any) {
    this.actionSource.next(options);
  }
}
