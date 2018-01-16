import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@shared/services';
import { Router } from '@angular/router';
import { Constants } from '@shared/constant';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-social-news-share',
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.scss'],
})

export class ZSocialNewsShareComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  profile$: Observable<any>;
  privacyClassIcon: string = 'fa-users';
  privacyName: string = 'public';
  tooltip: any = Constants.tooltip;

  form: FormGroup;
  descCtrl: AbstractControl;

  constructor(private router: Router, private userService: UserService) {

  }

  ngOnInit() {
    this.profile$ = this.userService.getAsyncProfile();
  }

  viewProfile(uuid: string = this.userService.getSyncProfile().uuid) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve', preserveFragment: true})
      .then(() => this.router.navigate(['profile', uuid]));
  }

  open() {
    console.log('tsss');
    this.modal.open();
  }

  customPrivacy(type: string, event: any) {
    event.preventDefault();
  }
}
