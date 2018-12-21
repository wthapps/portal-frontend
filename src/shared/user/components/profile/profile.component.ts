import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WModalService } from '@shared/modal';
import { NameEditModalComponent } from '@shared/user/components/cover-info/name-edit-modal.component';


@Component ({
  selector: 'w-user-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss']
})
export class ProfileComponent {
  @Input() data: any;
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeAvatar: EventEmitter<any> = new EventEmitter<any>();


  constructor(private modalService: WModalService) {
    this.modalService.submit$.subscribe(payload => {
      this.onUpdate(payload);
    });
  }

  openModal(payload: any) {
    switch (payload.modalName) {
      case 'NameEditModal':
        this.modalService.open(NameEditModalComponent, {user: payload.user});
        break;
    }
  }

  onUpdate(profile: any) {
    this.update.emit(profile);
  }

  onChangeAvatar(profile: any) {
    this.changeAvatar.emit(profile);
  }
}
