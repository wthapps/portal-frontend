import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {
  FormGroup,
  AbstractControl,
  FormBuilder
} from '@angular/forms';
import { ConfirmationService } from 'primeng/components/common/api';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-setting',
  templateUrl: 'setting.component.html'
})
export class ZChatSettingComponent implements OnInit{

  form: FormGroup;
  import_information: AbstractControl;
  online: AbstractControl;
  time_to_history: AbstractControl;
  privacy:string;
  setting:any;

  constructor(private fb: FormBuilder,
              private location: Location,
              private chatService: ChatService,
              private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.chatService.getSetting().subscribe(
      (res:any) => {
        this.setting = res.data;
        this.form = this.fb.group({
          'import_information': this.setting.import_information,
          'online': this.setting.online,
          'time_to_history': this.setting.time_to_history,
          'privacy': this.setting.privacy
        });
        this.import_information = this.form.controls['import_information'];
        this.online = this.form.controls['online'];
        this.time_to_history = this.form.controls['time_to_history'];
        this.privacy = this.setting.privacy;
      }
    );
  }


  onSubmit(value: any) {
    value.privacy = this.privacy;
    this.chatService.updateSetting(value).subscribe(
      (res:any) => {
        this.setting = res.data;
      }
    );
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
        this.chatService.restoreSetting().subscribe(
          (res:any) => {
            this.setting = res.data;
            this.import_information.setValue(this.setting.import_information);
            this.online.setValue(this.setting.online);
            this.time_to_history.setValue(this.setting.time_to_history);
            this.privacy = this.setting.privacy;
          }
        );
      }
    });
  }

  onCancel() {
    this.location.back();
  }
}
