import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { UserService } from '.';

/**
 * This injectable class is a wrapper for the native Page Visibility API
 * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
@Injectable()
export class PageVisibilityService {
  hiddenState$: Observable<boolean>;

  private hiddenStateSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private userService: UserService) {
    this.hiddenState$ = this.hiddenStateSubject.asObservable();
    this.registerVisibilityChange();
  }

  reloadIfProfileInvalid() {
    this.hiddenState$
    .subscribe(hidden => {
      if (!hidden && this.userService.isProfileUpdated()) {
        window.location.reload();
      }
    });
  }

  registerVisibilityChange() {
    // Set the name of the hidden property and the change event for visibility
    let hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document['msHidden'] !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document['webkitHidden'] !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
      console.log('This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.');
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, () => this.hiddenStateSubject.next(document[hidden]), false);

    }
  }

}
