import { Component, OnInit, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { ZoneReportService } from './report.service';
import {ApiBaseService} from "../../../../core/shared/services/apibase.service";
import {LoadingService} from "../../../../core/partials/loading/loading.service";
import {HdModalComponent} from "../../ng2-hd/modal/components/modal";
// import { HdModalComponent } from '../../ng2-hd/modal/components/modal';
// import { ApiBaseService } from '../../../../shared/services/apibase.service';
// import { LoadingService } from '../../../../partials/loading/loading.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'wth-zone-report',
  templateUrl: 'report.component.html'
})
export class ZoneReportComponent implements OnInit {
  @ViewChild('modal') modal: HdModalComponent;

  REASONS: Array<any> = [
    {id: 1, description: 'Spam or Scam', entity: 'post;community'},
    {id: 2, description: 'Hate Speech or Personal Harassment', entity: 'post;community;member'},
    {id: 3, description: 'Inappropriate content or Fail Information', entity: 'post;member;community'},
    {id: 4, description: 'Adult content without marked “Adult content”', entity: 'post'},
    {id: 4, description: 'Duplicate, fake or misleading', entity: 'community'},
    {id: 1, description: 'Fake Account or Impersonating', entity: 'member'},
    {id: 99, description: 'Other', entity: 'member;post;community'}
  ];

  reasons: Array<any> = [];
  uuid: string = '';
  entityType: string = '';
  reason: any = {id: 0, description: ''};
  errorMessage: string = '';

  form: FormGroup;
  other: AbstractControl;

  constructor(private zoneReportService: ZoneReportService,
              private fb: FormBuilder,
              private apiBaseService: ApiBaseService,
              private loadingService: LoadingService) {

    this.form = fb.group({
      'other': ['']
    });

    this.other = this.form.controls['other'];

    zoneReportService.set = this.activate.bind(this);
  }

  ngOnInit() {
  }

  activate(type: string, uuid: string) {
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show(type, uuid);
    });
    return promise;
  }

  getValue(reason: any = {id: 0, description: ''}): any {
    this.reason = reason;
    return this.reason;
  }

  onSubmit(values: any): void {
    let body = JSON.stringify({
      object_id: this.uuid,
      entity: this.entityType == 'post' ? 1 : this.entityType == 'member' ? 2 : 3,
      reports: [{id: this.reason.id, description: this.reason.id == 99 ? values.other : this.reason.description}]
    });
    this.apiBaseService.post(`zone/social_network/userreports`, body)
      .subscribe((result: any) => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
    this.modal.close();
  }

  private show(type: string, uuid: string) {
    (<FormControl>this.other).setValue('');

    this.uuid = uuid;
    this.entityType = type;
    // this.reason     = {id: 0, description: ''};
    this.reasons = _.filter(this.REASONS, (reason: any) => {
      return reason.entity.indexOf(type) !== -1;
    });
    this.modal.open();
    // console.log('testing...........', this);
  }
}
