import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiBaseService } from '../apibase.service';


@Injectable()
export class PhotoService extends ApiBaseService {

  url: string = 'zone/photos/';

  constructor(http: Http, router: Router) {
    super(http, router);
  }

}
