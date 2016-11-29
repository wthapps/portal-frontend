import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'z-social-community-form-edit',
  templateUrl: 'edit.component.html'
})

export class ZSocialCommunityFormEditComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  list: any = [];
  maxLength: number = 0;
  currentUUID: string = '';


  form: FormGroup;
  community_name: AbstractControl;
  tag_line: AbstractControl;
  description: AbstractControl;
  external_title: AbstractControl;
  external_link: AbstractControl;


  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private userService: UserService) {

    this.form = fb.group({
      'community_name': ['', Validators.compose([Validators.required])],
      'tag_line': ['', Validators.maxLength(150)],
      'description': [''],
      'external_title': [''],
      'external_link': ['']
    });

    this.community_name = this.form.controls['community_name'];
    this.tag_line = this.form.controls['tag_line'];
    this.description = this.form.controls['description'];
    this.external_title = this.form.controls['external_title'];
    this.external_link = this.form.controls['external_link'];
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.data) {
      console.log(this.data);
      (<FormControl>this.community_name).setValue(this.data.name);
      (<FormControl>this.tag_line).setValue(this.data.tag_line);
      (<FormControl>this.description).setValue(this.data.description);
      (<FormControl>this.external_title).setValue('');
      (<FormControl>this.external_link).setValue('');
    }
  }

  onCheckLength(event: any) {
    $(event.target).parents('.form-group').find('.x-showLength').text(event.target.value.length);
    // console.log(event.target.value.length);
    // console.log(this.tag_line.value);
  }

  onSubmit(values: any): void {
    console.log(values);

    let body = JSON.stringify({
      name: values.community_name,
      tag_line: values.tag_line,
      description: values.description,
      additional_links: ''
    });

    this.apiBaseServiceV2.put(`zone/social_network/communities/${this.data.uuid}`, body)
      .subscribe((result: any) => {
          console.log(result);
          this.updated.emit(result.data);
        },
        error => {
          console.log(error);
        }
      );

    this.modal.close();
  }
}
