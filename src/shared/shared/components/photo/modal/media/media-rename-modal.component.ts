import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';

declare var $: any;
declare var _: any;

@Component({
  selector: 'me-rename-modal',
  templateUrl: 'media-rename-modal.component.html'
})
export class MediaRenameModalComponent implements OnInit, OnChanges {
  @ViewChild('modal') modal: BsModalComponent;

  @Input() data: any = null;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  formValue: any;
  form: FormGroup;
  name: AbstractControl;
  objectType: string = 'photo';

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['',
        Validators.compose([Validators.required])
      ]
    });

    this.name = this.form.controls['name'];
  }

  ngOnInit(): void {

  }

  ngOnChanges(data:any): void {
    if (this.data) {
      // update form
      (<FormControl>this.name).setValue(this.data.name);
    }
  }

  open(options?: any) {
    // console.log(options);
    this.data = options['selectedObject'];
    this.objectType = this.data.object_type;
    (<FormControl>this.name).setValue(this.data.name);
    this.modal.open();
  }

  close(options?: any) {
    this.modal.close();
  }

  onSubmit(values: any): void {
    if (this.form.valid) {
      this.data.name = values.name;
      this.event.emit({action: 'editName', params: {selectedObject: this.data}});
      this.modal.close();
    }
  }
}
