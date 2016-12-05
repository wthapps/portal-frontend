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
  FormControl,
  FormArray
} from '@angular/forms';
import { CustomValidator } from '../../../../shared/validator/custom.validator';

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
  @Input() action: string;
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
      'additional_links': fb.array([
        this.initLink(),
      ])
    });

    this.community_name = this.form.controls['community_name'];
    this.tag_line = this.form.controls['tag_line'];
    this.description = this.form.controls['description'];
  }

  ngOnInit() {

  }

  ngOnChanges() {
    let _this = this;
    // console.log(this.form.controls['additional_links'].controls.length=0);
    if (this.data) {
      // console.log(this.form);
      // console.log(this.data.additional_links);
      this.removeAllLink();
    }
    if (this.action == 'edit') {
      (<FormControl>this.community_name).setValue(this.data.name);
      (<FormControl>this.tag_line).setValue(this.data.tag_line);
      (<FormControl>this.description).setValue(this.data.description);

      let additional_links_edit = this.data.additional_links;
      _.map(additional_links_edit, (v)=> {
        _this.addLink(v);
      });

    } else {
      (<FormControl>this.community_name).setValue('');
      (<FormControl>this.tag_line).setValue('');
      (<FormControl>this.description).setValue('');
    }
  }

  onCheckLength(event: any) {
    $(event.target).parents('.form-group').find('.x-showLength').text(event.target.value.length);
  }


  initLink(link?: any) {

    if (link) {
      return this.fb.group({
        key: [link.name.toLowerCase().replace(' ','_')],
        name: [link.name],
        url: [link.url, Validators.compose([CustomValidator.url])],
        order: [link.order]
      });
    } else {
      return this.fb.group({
        key: [''],
        name: [''],
        url: ['', Validators.compose([CustomValidator.url])],
        order: ['']
      });
    }
  }

  addLink(link?: any) {
    const control = <FormArray>this.form.controls['additional_links'];
    if (link) {
      control.push(this.initLink(link));
    } else {
      control.push(this.initLink());
    }

  }

  removeLink(i: number) {
    const control = <FormArray>this.form.controls['additional_links'];
    control.removeAt(i);
  }

  removeAllLink() {
    const control = <FormArray>this.form.controls['additional_links'];
    // console.log(control.length);
    for (let i = 0; i < control.length; i++) {
      control.removeAt(i);
      control.reset();
    }
  }

  onHideModal() {
    const control = <FormArray>this.form.controls['additional_links'];
    console.log(control);
    this.modal.close();
  }

  onSubmit(values: any): void {
    console.log(values.additional_links);
    console.log('filter:', _.filter(values.additional_links, ['url', null]));

    let body = JSON.stringify({
      name: values.community_name,
      tag_line: values.tag_line,
      description: values.description,
      additional_links: values.additional_links
    });

    console.log('body:', body);

    if (this.action == 'edit') {
      this.apiBaseServiceV2.put(`zone/social_network/communities/${this.data.uuid}`, body)
        .subscribe((result: any) => {
            // console.log(result);
            this.updated.emit(result.data);
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.apiBaseServiceV2.post(`zone/social_network/communities`, body)
        .subscribe((result: any) => {
            // console.log(result);
            this.updated.emit(result.data);
          },
          error => {
            console.log(error);
          }
        );
    }


    this.modal.close();
  }
}
