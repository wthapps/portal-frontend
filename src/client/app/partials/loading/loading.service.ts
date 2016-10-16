import { Injectable } from '@angular/core';

// Please use LoadingDirective and LoadingModalDirective
@Injectable()
export class LoadingService {
  set: (action: boolean, el: string) => Promise<boolean>;

  start(el: string = null) {
    this.set(true, el);
  }

  stop(el: string = null) {
    this.set(false, el);
  }
}

