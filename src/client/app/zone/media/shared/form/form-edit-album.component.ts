import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';
import { ZMediaAlbumService } from '../../album/album.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-form-edit-album',
  templateUrl: 'form-edit-album.component.html',
})
export class ZMediaFormEditAlbumComponent implements AfterViewInit {
  @ViewChild('modal') modal: HdModalComponent;

  @Input() selectedPhotos: any;

  showToast: boolean = false;
  selectedAlbum: any;

  form: FormGroup;
  name: AbstractControl;
  description: AbstractControl;

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
    $(document).on('hidden.bs.modal', '.modal', function () {
      if($('.modal:visible').length){
        $(document.body).addClass('modal-open');
      }
    });
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
