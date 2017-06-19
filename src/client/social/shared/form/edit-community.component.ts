import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormArray, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../core/shared/validator/custom.validator';
import { SoCommunityService } from '../services/community.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-share-community-form-edit',
  templateUrl: 'edit-community.component.html'
})

export class ZSocialShareCommunityFormEditComponent {
  @ViewChild('modal') modal: ModalComponent;
  @Input() data: any;
  @Output() setupDataUpdated: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  community_name: AbstractControl;
  tag_line: AbstractControl;
  description: AbstractControl;

  constructor(private fb: FormBuilder, private communityService: SoCommunityService) {
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

  //additional_links
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

  onOpenModal() {

    let _this = this;
    (<FormControl>this.community_name).setValue(this.data.name);
    (<FormControl>this.tag_line).setValue(this.data.tag_line);
    (<FormControl>this.description).setValue(this.data.description);

    _this.removeAll();

    _.map(this.data.additional_links, (v: any)=> {
      _this.addItem(v);
    });

    this.modal.open();
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


    this.communityService.updateCommunity(this.data.uuid, body).subscribe((res: any) => {
      this.setupDataUpdated.emit(res.data);
      this.modal.close();
    });
  }
}
