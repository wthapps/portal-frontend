import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiBaseService } from './apibase.service';
import { Constants } from '../config/constants';


declare let _ : any;
/*
  This service support navigate to or redirect to another module between my apps, social, chat, media ...
 */
@Injectable()
export class WTHNavigateService {

  constructor(private router: Router) {
  }

  navigateOrRedirect(path: string, module?: string, queryParams: any = {}) {
    if(!_.isEmpty(module)) {
      switch (module) {
        case 'media':
          this.redirectIfNeed(path, Constants.baseUrls.media, queryParams);
          break;
        case 'social':
          this.redirectIfNeed(path, Constants.baseUrls.social, queryParams);
          break;
        case 'chat':
          this.redirectIfNeed(path, Constants.baseUrls.chat, queryParams);
          break;
        case 'my':
          this.redirectIfNeed(path, Constants.baseUrls.myAccount, queryParams);
          break;
        case 'contact':
          this.redirectIfNeed(path, Constants.baseUrls.contact, queryParams);
          break;
        case 'note':
          this.redirectIfNeed(path, Constants.baseUrls.note, queryParams);
          break;
        default:
          break;
      }
    }

    // Do not allow redirect to root path
    if (!_.isEmpty(path)) {
      if(path.indexOf('posts') > -1) {
        let urls: string[] = path.split('/');
        this.router.navigate([{outlets: {detail: [...urls]}}], {queryParamsHandling: 'preserve', preserveFragment: true});
      } else {
        this.router.navigate([path, {outlets: {modal: null, detail: null}}], {queryParams: queryParams});
        if(['/', ''].includes(path))
          this.router.navigate(['']);
      }
    }


    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  // Redirect if page is in another module
  private redirectIfNeed( path: string, baseUrl: string, queryParams: any) {
    if(!this.inSameModule(baseUrl)) {
      window.location.href = this.buildUrl(baseUrl, path, queryParams);
      return;
    }
  }

  private buildUrl(url: string, path: string, body?: any) {
    let fullUrl = url;

    // Not support redirect to root path
    if (!_.isEmpty(path) )
      fullUrl += '/' + path;
    if (typeof body == 'object') {
      fullUrl += '?' + this.paramsToString(body);
    }
    return fullUrl;
  }

  private inSameModule(moduleFullName: string) {
    return window.location.origin === moduleFullName;
  }

  private paramsToString(params: any): string {
    let str: string = '';
    for (let param in params) {
      str += param + '=' + params[param] + '&';
    }
    str = str.slice(0, -1);
    return str;
  }


}
