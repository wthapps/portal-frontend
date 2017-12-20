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

  parse(href?: any) {
    if(!href) {
      href = window.location.href;
    }
    let link = document.createElement("a");
    link.href = href;
    let hashes: any = {};
    hashes.hostname = link.hostname;
    hashes.pathname = link.pathname;
    hashes.paths = link.pathname.split('/');
    hashes.paths.shift();
    hashes.id = hashes.paths[hashes.paths.length -1];
    return hashes;
  }
}
