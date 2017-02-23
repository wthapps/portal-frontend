import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {
  FormGroup,
  AbstractControl,
  FormBuilder
} from '@angular/forms';
import { ConfirmationService } from 'primeng/components/common/api';

@Component({
  moduleId: module.id,
  selector: 'z-chat-setting',
  templateUrl: 'setting.component.html'
})
export class ZChatSettingComponent implements OnInit{

  form: FormGroup;
  import_information: AbstractControl;
  hide_online: AbstractControl;
  time_to_history: AbstractControl;
  private: number = 1;

  constructor(private fb: FormBuilder,
              private location: Location,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    console.log('settings');
    this.form = this.fb.group({
      'import_information': [true],
      'hide_online': [true],
      'time_to_history': [12]
    });
    this.import_information = this.form.controls['import_information'];
    this.hide_online = this.form.controls['hide_online'];
    this.time_to_history = this.form.controls['time_to_history'];
  }


  onSubmit(value: any) {
    console.log(value);
  }


  onDeleteChat() {
    this.confirmationService.confirm({
      message: 'Are you sure to delete conversation?',
      header: 'Delete',
      accept: () => {
        //Actual logic to perform a confirmation
      }
    });
  }

  resetSettings() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset settings?',
      header: 'Reset Default',
      accept: () => {
        //Actual logic to perform a confirmation
      }
    });
  }

  onCancel() {
    this.location.back();
  }
}
