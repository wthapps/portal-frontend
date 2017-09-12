import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ConfirmInfo, WthConfirmService } from './wth-confirm.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'wth-confirm',
  templateUrl: 'wth-confirm.component.html',
})
export class WthConfirmComponent {

  public confirmInfo$: Observable<ConfirmInfo>;

  constructor(private wthConfirmService: WthConfirmService) {
    this.confirmInfo$ = this.wthConfirmService.confirmDialog$;
  }

}
