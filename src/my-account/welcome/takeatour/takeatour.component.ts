import { Component, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { UserService } from '@wth/shared/services/user.service';
import { PartialsBasicInfoComponent } from '@wth/shared/shared/components/profile/basic-info/basic-info.component';
import { InviteModel } from '@wth/shared/shared/models/profile/profile.model';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { ApiBaseService } from '@wth/shared/services/apibase.service';
import { InvitationService } from '@wth/shared/shared/components/invitation/invitation.service';
import { Router } from '@angular/router';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'page-takeatour',
  templateUrl: 'takeatour.component.html',
  styleUrls: ['takeatour.component.scss']
})

export class TakeATourComponent implements OnInit {
  @ViewChild('basicInfo') basicInfo: PartialsBasicInfoComponent;

  isLoading: boolean = false;

  loadingTitle: string = '';
  loadingContent: string = '';

  step: number = 1;

  formInvite: FormGroup;

  constructor(private userService: UserService,
              private apiBaseService: ApiBaseService,
              private invitationService: InvitationService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formInvite = this.fb.group({
      'invites': this.fb.array([
        this.initItem('invites'),
      ])
    });
  }

  removeAll(controls: string[] = ['invites']) {
    _.map(controls, (v: string) => {
      const control = <FormArray>this.formInvite.controls[v];
      control.controls.length = 0;
      control.reset();
    });

  }

  //emails
  initItem(type: string, item?: any) {
    let data: any = null;
    let fbGroup: any = null;

    switch (type) {
      case 'invites':
        data = item ? item : new InviteModel();
        fbGroup = this.fb.group({
          fullName: [data.fullName, Validators.compose([Validators.required])],
          email: [data.email, Validators.compose([Validators.required, CustomValidator.emailFormat])]
        });
        break;
      default:
        break;
    }

    return fbGroup;
  }

  addItem(type: string, item: any = null) {
    const control = <FormArray>this.formInvite.controls[type];
    control.push(this.initItem(type, item));
  }

  removeItem(type: string, i: number) {
    const control = <FormArray>this.formInvite.controls[type];
    control.removeAt(i);
  }

  skipTo(i: number) {
    this.step = i;
  }

  submitInfo() {
    console.log(this.basicInfo.form.value);

    this.isLoading = true;
    this.loadingTitle = 'Updating your profile';
    this.loadingContent = 'Your friends will receive your invitation shortly';

    this.apiBaseService
      .put(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`, this.basicInfo.form.value)
      .subscribe(
        (res: any) => {
          console.log(res);
          this.isLoading = false;
          this.step = 2;
        });
  }


  saveFinish(value: any) {
    console.log(value.invites);
    console.log(this.formInvite.controls.invites.valid);

    if (value.invites) {
      this.isLoading = true;
      this.loadingTitle = 'Sending invitation';
      this.loadingContent = 'Your public profile will be ready in a few second.';

      this.invitationService.create({recipients: value.invites}).subscribe(
        (res: any) => {
          console.log(res);
          this.isLoading = false;
          this.router.navigate(['/welcome/done']);
        }
      );
    } else {
      this.router.navigate(['/welcome/done']);
    }


  }
}
