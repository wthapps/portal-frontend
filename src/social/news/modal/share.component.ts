import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@shared/services';
import { Router } from '@angular/router';
import { Constants } from '@shared/constant';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-social-news-share',
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.scss'],
})

export class ZSocialNewsShareComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  article: any = {
    uri: 'https://i-kinhdoanh.vnecdn.net/2018/01/10/biencam1-3203-1515575867_140x84.jpg',
    link: 'https://www.youtube.com/watch?v=9b8f5nVOOUo',
  };

  profile$: Observable<any>;
  privacyClassIcon: string = 'fa-users';
  privacyName: string = 'public';
  tooltip: any = Constants.tooltip;

  form: FormGroup;
  descCtrl: AbstractControl;

  constructor(private fb: FormBuilder,
              private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.profile$ = this.userService.getAsyncProfile();
    this.form = this.fb.group({
      'description': ''
    });

    this.descCtrl = this.form.controls['description'];
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
