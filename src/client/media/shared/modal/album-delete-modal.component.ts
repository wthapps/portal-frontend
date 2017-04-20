import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { ZMediaAlbumService } from '../../album/album.service';
import { Constants } from '../../../core/shared/config/constants';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'album-delete-modal',
  templateUrl: 'album-delete-modal.component.html',
})
export class AlbumDeleteModalComponent implements BaseMediaModal, AfterViewInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  selectedAlbums: any;

  checked: boolean = false;

  constructor() {
  }

  ngAfterViewInit() {
    $(document).on('hidden.bs.modal', '.modal', ()=> {
      if ($('.modal:visible').length) {
        $(document.body).addClass('modal-open');
      }
    });
  }

  open(options?: any) {
    // console.log(options);
    this.selectedAlbums = options['selectedObjects'];
    this.modal.open();
  }

  close(options?: any) {
    this.modal.close();
  }

  onDelete(): void {
    this.modal.close();
    console.log('onDelete');
    if (this.checked) {
      this.event.emit({action: 'deleteAlbumPhotos', params: {selectedObject: this.selectedAlbums}});
    } else {
      this.event.emit({action: 'deleteAlbum', params: {selectedObject: this.selectedAlbums}});
    }
  }
}
