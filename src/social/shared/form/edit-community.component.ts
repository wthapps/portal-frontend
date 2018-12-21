import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormArray, FormControl
} from '@angular/forms';


import { BsModalComponent } from 'ng2-bs3-modal';

import { SoCommunityService } from '../services/community.service';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { SHORTCUT_ADD_MULTI_DONE } from '../reducers/index';
import { Store } from '@ngrx/store';


@Component({
  selector: 'z-social-share-community-form-edit',
  templateUrl: 'edit-community.component.html'
})

export class ZSocialShareCommunityFormEditComponent {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() data: any = null;
  @Input() action = 'update'; // update, create
  @Output() setupDataUpdated: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  community_name: AbstractControl;
  tag_line: AbstractControl;
  description: AbstractControl;

  constructor(private fb: FormBuilder, private communityService: SoCommunityService,
              private store: Store<any>) {
    this.form = fb.group(
      {
        'community_name': ['', Validators.compose([Validators.required])],
        'tag_line': ['', Validators.maxLength(150)],
        'description': [''],
        'additional_links': fb.array([
          this.initItem(),
        ])
      }
    );

    this.community_name = this.form.controls['community_name'];
    this.tag_line = this.form.controls['tag_line'];
    this.description = this.form.controls['description'];
  }

  removeAll() {
    const control = <FormArray>this.form.controls['additional_links'];
    control.controls.length = 0;
    control.reset();
  }

  // additional_links
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        key: [item.name.toLowerCase().replace(' ', '_')],
        name: [item.name],
        url: [item.url, Validators.compose([CustomValidator.urlFormat])],
        order: [item.order]
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

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['additional_links'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['additional_links'];
    control.removeAt(i);
  }

  onOpenModal(data?: any) {
    this.removeAll();

    this.community_name.reset();
    this.tag_line.reset();
    this.description.reset();
    this.data = _.cloneDeep(data);

    if (data) {
      (<FormControl>this.community_name).setValue(data.name);
      (<FormControl>this.tag_line).setValue(data.tag_line);
      (<FormControl>this.description).setValue(data.description);
      const _this = this;
      if (_.get(this.data, 'additional_links') !== undefined) {
        _.map(this.data.additional_links, (v: any) => {
          _this.addItem(v);
        });
      }

    } else {
      (<FormControl>this.community_name).setValue('');
      (<FormControl>this.tag_line).setValue('');
      (<FormControl>this.description).setValue('');
    }
    this.modal.open();
  }

  additionalLinkControls() {
    return (<FormGroup>(<FormGroup>this.form).controls.additional_links).controls;
  }


  onSubmit(values: any): void {
    const additional_links_filter: any = [];
    _.map(values.additional_links, (v: any) => {
      if (v.url) {
        additional_links_filter.push(v);
      }
    });

    const body = JSON.stringify({
      name: values.community_name,
      tag_line: values.tag_line,
      description: values.description,
      additional_links: additional_links_filter
    });

    if (this.action === 'update') {
      this.communityService.updateCommunity(this.data.uuid, body).toPromise().then((res: any) => {
        this.setupDataUpdated.emit(res.data);
        this.modal.close();
      });
    } else {
      this.communityService.createCommunity(body).toPromise().then((res: any) => {
        this.setupDataUpdated.emit(res.data);

        //  Update shortcut list if posible
        if (res.shortcut) {
          this.store.dispatch({type: SHORTCUT_ADD_MULTI_DONE, payload: res.shortcut});
        }
        this.modal.close();
      });
    }
  }
}
