import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService, ApiBaseService, BaseEntityService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';


declare let _: any;
/**
 *
 */
@Injectable()
export class SoShortcutService extends BaseEntityService<any> {
  readonly soShortcutUrl: string = Constants.urls.zoneSoShortcuts;

  constructor(protected apiBaseService: ApiBaseService,
              private router: Router,
              private userService: UserService
  ) {
    super(apiBaseService);
    this.url = this.soShortcutUrl;
  }

  getSuggestions(q: any): Observable<any> {
    return this.apiBaseService.post(`${this.url}/suggestions`, {q});
  }

  create(body: any, multiple: boolean=false): Observable<any> {
    let ids: any[] = body.map(c => c.id);
    return super.create({ids}, multiple);
  }

  deleteMulti(ids: any): Observable<any> {
    return this.apiBaseService.post(`${this.url}/delete_multi`, {ids});
  }
}

