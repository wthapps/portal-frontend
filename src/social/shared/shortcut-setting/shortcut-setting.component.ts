import { Component, ViewChild } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from 'social/shared/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'z-social-shortcut-setting',
  templateUrl: 'shortcut-setting.component.html',
  styleUrls: ['shortcut-setting.component.scss']
})

export class ZSocialShortcutSettingComponent {
  @ViewChild('modal') modal: ModalComponent;

  shortcuts$: Observable<any>;

  constructor(private store: Store<any>) {
    this.shortcuts$ = this.store.select(fromRoot.getShortcuts);
  }


}
