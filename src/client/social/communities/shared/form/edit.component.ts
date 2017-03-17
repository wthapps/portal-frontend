import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';

// import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { CustomValidator } from '../../../../core/shared/validator/custom.validator';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../../core/partials/loading/loading.service';
import { UserService } from '../../../../core/shared/services/user.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';
import { Constants } from '../../../../core/shared/config/constants';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-form-edit',
  templateUrl: 'edit.component.html'
})

export class ZSocialCommunityFormEditComponent implements OnInit, OnChanges {

  // @ViewChild('modal') modal: ModalComponent;
  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Input() action: string;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  list: any = [];
  maxLength: number = 0;
  currentUUID: string = '';
  readonly communitiesUrl: string = Constants.urls.zoneSoCommunities;


  form: FormGroup;
  community_name: AbstractControl;
  tag_line: AbstractControl;
  description: AbstractControl;

  constructor(private fb: FormBuilder,
              private apiBaseService: ApiBaseService,
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
    this.removeAllLink();
  }

  ngOnChanges() {
    this.removeAllLink();
    let _this = this;
    // console.log(this.form.controls['additional_links'].controls.length=0);
    if (this.data) {
      this.removeAllLink();
      if (this.action == 'edit') {
        this.removeAllLink();
        (<FormControl>this.community_name).setValue(this.data.name);
        (<FormControl>this.tag_line).setValue(this.data.tag_line);
        (<FormControl>this.description).setValue(this.data.description);

        let additional_links_edit = this.data.additional_links;
        _.map(additional_links_edit, (v: any)=> {
          _this.addLink(v);
        });

      } else {
        this.removeAllLink();
        (<FormControl>this.community_name).setValue('');
        (<FormControl>this.tag_line).setValue('');
        (<FormControl>this.description).setValue('');
      }
    }

  }

  initLink(link?: any) {

    if (link) {
      return this.fb.group({
        key: [link.name.toLowerCase().replace(' ', '_')],
        name: [link.name],
        url: [link.url, Validators.compose([CustomValidator.urlFormat])],
        order: [link.order]
      });
    } else {
      return this.fb.group({
        key: [''],
        name: [''],
        url: ['', Validators.compose([CustomValidator.urlFormat])],
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
    let additional_links_filter: any = [];
    _.map(values.additional_links, (v: any)=> {
      if (v.url) {
        additional_links_filter.push(v);
      }
    });

    let body = JSON.stringify({
      name: values.community_name,
      tag_line: values.tag_line,
      description: values.description,
      additional_links: additional_links_filter
    });

    if (this.action == 'edit') {
      this.apiBaseService.put(`${this.communitiesUrl}/${this.data.uuid}`, body)
        .subscribe((result: any) => {
            // console.log(result);
            this.updated.emit(result.data);
          },
          (error: any) => {
            console.log(error);
          }
        );
    } else {
      this.apiBaseService.post(`${this.communitiesUrl}`, body)
        .subscribe((result: any) => {
            // console.log(result);
            this.updated.emit(result.data);
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
    this.modal.close();
  }

  resetFormInputs(): void {
    this.community_name.reset('');
    this.tag_line.reset('');
    this.description.reset('');
  }
}
