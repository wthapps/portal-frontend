/**
 * Created by anvo on 14/06/2017.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MediaUploaderDataService {
  showUp$: any;
  action$ : any;
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
