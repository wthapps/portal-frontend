import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WthAppsBaseModal } from '../../core/shared/interfaces/base-media-modal';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Label } from './label.model';
import { LabelService } from './label.service';

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

  constructor(private fb: FormBuilder, private labelService: LabelService)  {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });
    this.name = this.form.controls['name'];

  }

  ngOnInit() {
    this.titleIcon = this.mode == 'edit' ? 'fa-edit' : 'fa-plus';
    this.titleName = this.mode == 'edit' ? 'Edit Label' : 'New Label';
  }

  submit() {
    if (this.mode == 'edit') {
      // this.labelService.update()
    } else {
      this.labelService.create(this.form.value).subscribe(
        (response: any) => {
          console.log('response:::::', response.data);

          // update list after added new label here

        }, (error: any)=> {

        }
      )
    }
  }

  open(options?: any) {
    this.modal.open(options)
      .then((res:any) => console.log('Sharing modal opened!!!', res));
  }
  close(options?: any) {

  }
}
