import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
  url: string;

  setUrl(url:string) {
    this.url = url;
  }

  getQuery() {
    let vars:any = [];
    let hash:any;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    // reset some functions default of array
    // vars["filter"] = "";
    for(var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  getId() {
    let urls = window.location.href.split('/');
    urls = urls[urls.length - 1].split('?');
    return urls[0];
  }

  getPatch() {
    return window.location.pathname;
  }
}
