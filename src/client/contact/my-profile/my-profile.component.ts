import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { UserService } from '../../core/shared/services/user.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZContactMyProfileComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  data: any;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`).subscribe((res: any) => {
      this.data = res.data;
    });
  }
}
