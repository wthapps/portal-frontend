import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-medial-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZMediaMyProfileComponent implements OnInit {
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
