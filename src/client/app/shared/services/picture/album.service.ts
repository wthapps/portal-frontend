import {Http} from '@angular/http';

import {Injectable} from '@angular/core';

import {ApiBaseServiceV2} from "../apibase.service.v2";
import { Router } from '@angular/router';

@Injectable()
export class AlbumService extends ApiBaseServiceV2 {

  url:string = 'zone/albums/';

  constructor(http: Http, private router: Router) {
    super(http, router);
  }

}
