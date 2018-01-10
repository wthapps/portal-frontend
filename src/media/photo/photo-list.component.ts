import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '@wth/shared/services';

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
    if (!this.userService.getSyncProfile().introduction.media) this.introModal.open();
  }
}
