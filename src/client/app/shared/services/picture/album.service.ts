import {Http} from '@angular/http';

import {Injectable} from '@angular/core';

import {BaseService} from "../base.service";

@Injectable()
export class AlbumService extends BaseService {

  url:string = 'zone/albums/';

  constructor(http: Http) {
    super(http);
  }

}
