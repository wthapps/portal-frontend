import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { Constants } from '../constant/config/constants';

declare let _: any;
/*
  This service support navigate to or redirect to another module between my apps, social, chat, media ...
 */
@Injectable()
export class WTHNavigateService {
  constructor(private router: Router) {}

  navigateOrRedirect(
    path: string,
    wModule: string = '',
    queryParams: any = {}
  ) {
    if (!_.isEmpty(wModule.toString())) {
      switch (wModule.toString()) {
        case 'media':
        case Constants.moduleMap.media:
          this.redirectIfNeed(path, Constants.baseUrls.media, queryParams);
          break;
        case 'social':
        case Constants.moduleMap.social:
          this.redirectIfNeed(path, Constants.baseUrls.social, queryParams);
          break;
        case 'chat':
        case Constants.moduleMap.chat:
          this.redirectIfNeed(path, Constants.baseUrls.chat, queryParams);
          break;
        case 'my':
        case Constants.moduleMap.myAccount:
          this.redirectIfNeed(path, Constants.baseUrls.myAccount, queryParams);
          break;
        case 'contact':
        case Constants.moduleMap.contact:
          this.redirectIfNeed(path, Constants.baseUrls.contact, queryParams);
          break;
        case 'note':
        case Constants.moduleMap.note:
          this.redirectIfNeed(path, Constants.baseUrls.note, queryParams);
          break;
        default:
          this.redirectIfNeed(path, Constants.baseUrls.app, queryParams);
          break;
      }
    }

    // Do not allow redirect to root path
    if (!_.isEmpty(path)) {
      if (path.indexOf('posts') > -1) {
        const urls: string[] = path.split('/');
        this.router.navigate([{ outlets: { detail: [...urls] } }], {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        });
      } else {
        this.router.navigate(
          [path, { outlets: { modal: null, detail: null } }],
          { queryParams: queryParams }
        );
        if (['/', ''].includes(path)) { this.router.navigate(['']); }
      }
    }

    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  navigateTo(path: string[], queryParams: any = {}) {
    this.router.navigate([{ outlets: { modal: null, detail: null } }], {
      queryParams: queryParams
    });
    this.router.navigate(path, { queryParams: queryParams });
  }

  inSameModule(moduleNames: string[]) {
    return moduleNames.includes(window.location.origin);
  }

  // Redirect if page is in another module
  private redirectIfNeed(path: string, baseUrl: string, queryParams: any) {
    if (!this.inSameModule([baseUrl])) {
      window.location.href = this.buildUrl(baseUrl, path, queryParams);
      return;
    }
  }

  private buildUrl(url: string, path: string, body?: any) {
    let fullUrl = url;

    // Not support redirect to root path
    if (!_.isEmpty(path)) { fullUrl += '/' + path; }
    if (typeof body === 'object') {
      fullUrl += '?' + this.paramsToString(body);
    }
    return fullUrl;
  }

  private paramsToString(params: any): string {
    let str = '';
    // tslint:disable-next-line:forin
    for (const param in params) {
      str += param + '=' + params[param] + '&';
    }
    str = str.slice(0, -1);
    return str;
  }
}
