import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '../../core/shared/services/user.service';

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  @ViewChild('introModal') introModal: any;

  constructor(private userService: UserService) {

  }

  ngOnInit() {
    if(!this.userService.profile.introduction.media) this.introModal.open();
  }
}
