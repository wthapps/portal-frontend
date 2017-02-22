import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiBaseService } from './apibase.service';

@Injectable()
export class AlbumService extends ApiBaseService {

  url: string = 'zone/albums/';

  constructor(http: Http, router: Router) {
    super(http, router, null);
  }

}
