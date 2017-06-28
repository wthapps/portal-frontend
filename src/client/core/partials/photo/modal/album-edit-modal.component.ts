import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Constants } from '../../../shared/config/constants';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'album-edit-modal',
  templateUrl: 'album-edit-modal.component.html',
})
export class AlbumEditModalComponent implements AfterViewInit {
  @ViewChild('modal') modal: ModalComponent;


  @Input() selectedPhotos: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  selectedAlbum: any;

  form: FormGroup;
  name: AbstractControl;
  description: AbstractControl;

  readonly urls = Constants.urls;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['',
        Validators.compose([Validators.required])
      ],
      'description': ['']
    });

    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];
  }

  ngAfterViewInit() {
    $(document).on('hidden.bs.modal', '.modal', ()=> {
      if ($('.modal:visible').length) {
        $(document.body).addClass('modal-open');
      }
    });
  }

  open(options?: any) {
    console.log('current album: ', options);
    this.selectedAlbum = options['selectedObject'];
    this.updateForm(options['selectedObject']);

    this.modal.open();
  }

  updateForm(values: any) {
    (<FormControl>this.name).setValue(values.name);
    (<FormControl>this.description).setValue(values.description);
  }

  close(options?: any) {
    this.modal.close();
  }

  onSubmit(values: any): void {
    if (this.form.valid) {
      this.modal.close();
      this.selectedAlbum.name = values.name;
      this.selectedAlbum.description = values.description;
      // console.log(this.selectedAlbum);
      this.event.emit({action: 'editInfo', params: {selectedObject: this.selectedAlbum}});
    }
  }
}
