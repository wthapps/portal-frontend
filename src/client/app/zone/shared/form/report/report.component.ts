import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ZoneReportService } from './report.service';
import { HdModalComponent } from '../../ng2-hd/modal/components/modal';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { LoadingService } from '../../../../partials/loading/loading.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'wth-zone-report',
  templateUrl: 'report.component.html'
})
export class ZoneReportComponent implements OnInit {
  @ViewChild('modal') modal: HdModalComponent;

  uuid: string = '';
  displayType: string = '';

  report_level: number;


  errorMessage: string = '';

  form: FormGroup;
  other: AbstractControl;

  constructor(private zoneReportService: ZoneReportService,
              private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
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

  getValue(value: any): any {
    console.log(value);
    return value;
  }

  onSubmit(values: any): void {
    console.log(values);

    if (this.displayType == 'member') { //member
      let body = JSON.stringify({
        report_level: this.report_level,
        other: values.other
      });
      console.log(body);
      this.apiBaseServiceV2.put(`zone/social_network/communities/${this.uuid}`, body)
        .subscribe((result: any) => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    } else if (this.displayType == 'member') { //member
      let body = JSON.stringify({
        report_level: this.report_level,
        other: values.other
      });
      console.log(body);
      this.apiBaseServiceV2.put(`zone/social_network/communities/${this.uuid}`, body)
        .subscribe((result: any) => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    } else { //post
      let body = JSON.stringify({
        report_level: this.report_level,
        other: values.other
      });
      console.log(body);
      this.apiBaseServiceV2.put(`zone/social_network/communities/${this.uuid}`, body)
        .subscribe((result: any) => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    }

    this.modal.close();
  }

  private show(type: string, uuid: string) {

    this.report_level = 0;
    (<FormControl>this.other).setValue('');

    this.uuid = uuid;
    this.displayType = type;

    this.modal.open();

    console.log('ZoneReportComponent:', type, uuid)
  }
}
