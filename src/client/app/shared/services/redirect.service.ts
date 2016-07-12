import {
  ActivatedRoute
}                           from '@angular/router';

import {
  Constants
}                           from '../index';

export class RedirectService {

  private linkDefault:string = '/';

  prev(link:ActivatedRoute):string {
    if (link.snapshot.params[`${Constants.params.next}`]) {
      // get current query string
      // convert '%20account%20setting%20dashboard' to '/account/setting/dashboard'
      this.linkDefault = link.snapshot.params[`${Constants.params.next}`].replace(/\%20/g, '\/');
    }

    return this.linkDefault;
  }
}
