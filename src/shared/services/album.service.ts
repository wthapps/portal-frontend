import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { ApiBaseService } from './apibase.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AlbumService extends ApiBaseService {
  url: string = 'zone/albums/';

  constructor(http: HttpClient, router: Router) {
    super(http, router, null);
  }
}
