import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '@wth/shared/services';

@Component({
  selector: 'app-partials-notification-setting-modal',
  templateUrl: 'modal.component.html'
})

export class NotificationSettingModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  social: Boolean = false;
  chat: Boolean = false;
  note: Boolean = false;
  media: Boolean = false;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor( public userService: UserService) {

    this.userService.notificationSetting$.pipe(
      takeUntil(this.destroySubject)
    ).subscribe((data: any) => {
      if(!_.isEmpty(data)) {
        this.social = data.enable_social;
        this.chat = data.enable_chat;
        this.note = data.enable_note;
        this.media = data.enable_media;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  open() {
    this.modal.open();

    //  Get notification settings if possible
    this.userService.getNotificationSetting();
  }

  onSave() {
    console.log(this.social, this.chat, this.note);

    this.userService.updateNotificationSetting({enable_social: this.social, enable_chat: this.chat,
      enable_note: this.note, enable_media: this.media });
    this.modal.close();
  }

}
