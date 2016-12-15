import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiBaseServiceV2 } from '../apibase.service.v2';

@Injectable()
export class AlbumService extends ApiBaseServiceV2 {

  url: string = 'zone/albums/';

  constructor(http: Http, router: Router) {
    super(http, router);
  }

}
