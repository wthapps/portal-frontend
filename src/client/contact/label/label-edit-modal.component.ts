import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WthAppsBaseModal } from '../../core/shared/interfaces/wthapps-base-modal';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Label } from './label.model';
import { LabelService } from './label.service';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';

// import { CommonEvent } from '../../core/shared/services/common-event/common-event';
// import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
// import { Subscription } from 'rxjs/Subscription';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'label-edit-modal',
  templateUrl: 'label-edit-modal.component.html',
  styleUrls: ['label-edit-modal.component.css']
})

export class LabelEditModalComponent implements OnInit, WthAppsBaseModal {
  @Input() mode: string;
  @Input() item: Label;

  @ViewChild('modal') modal: ModalComponent;
  event: any;
  titleIcon: string;
  titleName: string;

  form: FormGroup;
  name: AbstractControl;

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService) {


  }

  ngOnInit() {
    this.titleIcon = this.mode == 'edit' ? 'fa-edit' : 'fa-plus';
    this.titleName = this.mode == 'edit' ? 'Edit Label' : 'New Label';

    this.form = this.fb.group({
      id: [this.item.id],
      'name': [this.item.name, Validators.compose([Validators.required])]
    });
    this.name = this.form.controls['name'];
  }

  submit() {
    if (this.mode == 'edit') {
      this.commonEventService.broadcast({action: 'contact:label:update', payload: {label: this.form.value}});
    } else {
      this.commonEventService.broadcast({action: 'contact:label:create', payload: {label: this.form.value}});
    }
    this.modal.close().then();
  }

  open(options?: any) {
    this.mode = options.mode || 'add';
    this.item = options.item || new Label();

    console.log('labellll', this.item);

    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }
}
