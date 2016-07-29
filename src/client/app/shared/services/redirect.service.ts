import {
  ActivatedRoute,
  RouterStateSnapshot
}                           from '@angular/router';

import {
  Constants
}                           from '../index';

export class RedirectService {

  private linkDefault:string = '/';
  private linkLogin:string = '/login';

  prev(link:ActivatedRoute):string {
    if (link.snapshot.params[`${Constants.params.next}`]) {
      // get current query string
      // convert '%20account%20setting%20dashboard' to '/account/setting/dashboard'
      this.linkDefault = link.snapshot.params[`${Constants.params.next}`].replace(/\%20/g, '\/');
    }

    return this.linkDefault;
  }

  toLogin(link:RouterStateSnapshot):string {
    if (link) {
      // get current query string
      // convert '/account/setting/dashboard' to '%20account%20setting%20dashboard'
      this.linkLogin = this.linkLogin + ';' +Constants.params.next + '=' + link.url.replace(/\//g, '\%20');
    }
    return this.linkLogin;
  }
}
