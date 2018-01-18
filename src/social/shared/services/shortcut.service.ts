import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

}

