import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WthAppsBaseModal } from '../../../../core/shared/interfaces/wthapps-base-modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { Label } from '../../../label/label.model';
import { LabelService } from '../../../label/label.service';
import { Constants } from '../../../../core/shared/config/constants';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'contact-add-label-modal',
  templateUrl: 'contact-add-label-modal.component.html',
  styleUrls: ['contact-add-label-modal.component.css']
})

export class ContactAddLabelModalComponent implements OnInit, WthAppsBaseModal {
  @Input() mode: string;
  @Input() contact: any;

  @ViewChild('modal') modal: ModalComponent;
  event: any;
  titleIcon: string;

  form: FormGroup;
  labelsCtrl: AbstractControl;
  labels: Array<string> = new Array<string>();
  originalLabels: Array<any> = new Array<any>();
  selectedLabels: Array<any> = [];
  inputLabels: Array<any> = [];

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService,
   private labelService: LabelService)  {

  }

  ngOnInit() {
    this.form = this.fb.group({
      'labels': [this.selectedLabels],
    });
    this.labelsCtrl = this.form.controls['labels'];
  }

  submit() {
    if (this.mode =='edit') {
      this.contact = _.pick(this.contact, ['id', 'labels']);
    }
    this.contact.labels = this.getSelectedLabels();
    this.commonEventService.broadcast({
      channel: Constants.contactEvents.common,
      action: 'contact:contact:update',
      payload: {selectedObjects: [this.contact]}}
    );
    this.modal.close().then();
  }

  open(options?: any) {
    this.mode = options.mode || 'add';
    this.contact = options.contact || null;
    this.inputLabels = options.labels || [];
    this.selectedLabels = [];
    _.forEach(this.inputLabels, (label: any) => {
      this.selectedLabels.push({value: label.name, display: label.name});
    });
    this.modal.open(options).then(() => {
      this.labelService.getAllLabels().then((labels: any[]) => {
        this.originalLabels = labels;
        this.labels = _.map(this.originalLabels, 'name');
      });
    });
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  validData(): boolean {
    let result: boolean = true;
    if (this.selectedLabels.length == 0 && this.inputLabels.length == 0){
      return false;
    }

    if(this.selectedLabels.length == this.inputLabels.length) {
      _.forEach(this.inputLabels, (l: any) => {
        _.forEach(this.selectedLabels, (sl: any) => {
          if (sl.value !== l.name) {
            result = false;
            return;
          }
        })
      });
    }
    return result;
  }

  removeTag(event: any) {}

  addTag(event: any) {}

  private getSelectedLabels(): Array<any> {
    let result: Array<any> = new Array<any>();

    _.forEach(this.selectedLabels, (label: any) => {
      result.push(_.find(this.originalLabels, {name: label.value}));
    });
    return result;
  }

}
