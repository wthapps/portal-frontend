import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
// This Data service is created for communitication between communities component and its child views
export class CommunitiesDataService {
  private postObs$ = new Subject();
  public loadingDone = false;

  getPost() {
    return this.postObs$ ;
  }

  updatePost(data: boolean) {
    this.postObs$.next(data);
  }


}
