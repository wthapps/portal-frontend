import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { UserService } from '../../core/shared/services/user.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZSocialMyProfileComponent implements OnInit {
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

  onOpen(user: any) {
    this.modal.open();
  }

  onClose() {
    setTimeout(()=> {
      console.log('adaafafaf');
    }, 500);
  }

  doEvent(e: any) {
    this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, this.data).subscribe((res: any) => {
      this.data = res.data;
    });
  }
}
