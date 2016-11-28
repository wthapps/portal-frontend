import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-list',
  templateUrl: 'list.component.html'
})

export class ZSocialCommunityListComponent implements OnInit {

  @ViewChild('modal') modal: HdModalComponent;

  errorMessage: string = '';
  myList: any = [];
  list: any = [];
  maxLength: number = 0;
  currentUUID: string = '';


  form: FormGroup;
  community_name: AbstractControl;
  tag_line: AbstractControl;
  external_title: AbstractControl;
  external_link: AbstractControl;


  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private userService: UserService) {

    this.form = fb.group({
      'community_name': ['', Validators.compose([Validators.required])],
      'tag_line': ['', Validators.maxLength(150)],
      'external_title': [''],
      'external_link': ['']
    });

    this.community_name = this.form.controls['community_name'];
    this.tag_line = this.form.controls['tag_line'];
    this.external_title = this.form.controls['external_title'];
    this.external_link = this.form.controls['external_link'];
  }

  ngOnInit() {
    this.loadingService.start('#communites-list');
    let myuuid = this.userService.profile.uuid;
    let _this = this;
    this.apiBaseServiceV2.get('zone/social_network/communities').subscribe(
      (res: any)=> {
        _.map(res.data, (v: any)=> {
          if (v.admin.uuid == myuuid) {
            _this.myList.push(v);
          } else {
            _this.list.push(v);
          }
        });
        this.loadingService.stop('#communites-list');

        // (<FormControl>this.host).setValue(result.data.name);
        // (<FormControl>this.ip).setValue(result.data.description);

      },
      error => this.errorMessage = <any>error
    );
  }

  onEdit(item: any) {
    this.modal.open();
    this.currentUUID = item.uuid;
    (<FormControl>this.community_name).setValue(item.name);
    (<FormControl>this.tag_line).setValue(item.tag_line);
    (<FormControl>this.external_title).setValue('');
    (<FormControl>this.external_link).setValue('');
    return false;
  }

  onCheckLength(event: any) {
    $(event.target).parents('.form-group').find('.x-showLength').text(event.target.value.length);
    // console.log(event.target.value.length);
    // console.log(this.tag_line.value);
  }

  onSubmit(values: any): void {
    console.log(values);

    let body = JSON.stringify({
      name: values.name,
      tag_line: values.tag_line
    });

    this.apiBaseServiceV2.put(`zone/social_network/communities/${this.currentUUID}`, body)
      .subscribe((result: any) => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );

  }
}
