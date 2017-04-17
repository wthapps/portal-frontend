import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ZMediaAlbumService } from '../../album/album.service';
import { Constants } from '../../../core/shared/config/constants';


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

  showToast: boolean = false;
  selectedAlbum: any;

  form: FormGroup;
  name: AbstractControl;
  description: AbstractControl;

  readonly urls = Constants.urls;

  constructor(private fb: FormBuilder,
              private albumService: ZMediaAlbumService) {
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

  open(options: any) {
    this.modal.open();
    this.updateForm(options['selectedObjects'][0]);
  }

  updateForm(values: any) {
    (<FormControl>this.name).setValue(values.name);
    (<FormControl>this.description).setValue(values.description);
  }

  onSubmit(values: any): void {
    let body = JSON.stringify({
      name: values.name,
      description: values.description
    });

    this.albumService.create(body).subscribe(
      (res: any)=> {
        if (res.success) {
          this.selectedAlbum = res.data;
          this.albumService.addToAlbum(res.data.id, this.selectedPhotos).subscribe(
            (res: any)=> {
              this.modal.close();
              this.showToast = true;
            }
          );
        }

      }
    );
  }
}
