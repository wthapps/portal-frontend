import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WthAppsBaseModal } from '../../../../core/shared/interfaces/wthapps-base-modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { Label } from '../../../label/label.model';
import { LabelService } from '../../../label/label.service';

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
  name: AbstractControl;
  labels: Array<string> = new Array<string>();
  originalLabels: Array<any> = new Array<any>();
  selectedLabels: Array<any> = [];

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService,
   private labelService: LabelService)  {



  }

  ngOnInit() {

    this.labelService.getAll().subscribe((response: any) => {
      this.originalLabels = response.data;
      // this.originalLabels = _.map(this.originalLabels, ['id','name']);
      this.labels = _.map(this.originalLabels, 'name');
    });

    // this.labelService.getAllLabels().then((labels: any) => {
    //   this.originalLabels = labels;
    //   this.labels = _.map(this.originalLabels, 'name');
    // })

    // this.titleIcon = this.mode == 'edit' ? 'fa-edit' : 'fa-plus';
    // this.titleName = this.mode == 'edit' ? 'Edit Label' : 'New Label';
    //
    // this.form = this.fb.group({
    //   id: [this.item.id],
    //   'name': [this.item.name, Validators.compose([Validators.required])]
    // });
    // this.name = this.form.controls['name'];
  }

  submit() {

    // find selectedLabels and push to label array
    _.forEach(this.selectedLabels, (label: any) => {
      this.contact.labels.push(_.find(this.originalLabels, {name: label.value}))
    });

    this.contact['labels_attributes'] = this.contact.labels;
    this.contact = _.pick(this.contact, ['id', 'labels_attributes']);

    this.commonEventService.broadcast({
      action: 'contact:contact:update',
      payload: { labels: this.selectedLabels, contact: this.contact }}
    );
    this.modal.close().then();
  }

  open(options?: any) {
    // this.mode = options.mode || 'add';
    this.contact = options.contact || null;
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  removeTag(event: any) {}

  addTag(event: any) {}
}
