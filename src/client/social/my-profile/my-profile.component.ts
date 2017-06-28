import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-social-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZSocialMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {

  }

  onOpen(user: any) {
    this.modal.open();
  }

  onClose() {

  }
}
