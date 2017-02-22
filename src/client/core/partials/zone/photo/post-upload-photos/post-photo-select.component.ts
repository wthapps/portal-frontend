import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { SoPhotoListComponent } from '../photo-list/photo-list.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-photo-select',
  templateUrl: 'post-photo-select.component.html'
})

export class PostPhotoSelectComponent {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('photoList') photoList: SoPhotoListComponent;
  @Input() selectedItems: Array<any>;
  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDismiss: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();
  action: string = 'NEXT';

  postPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  hasBack: boolean = false;
  files: Array<any> = new Array<any>();

  open(options: any = {return: false}) {
    if (options.return == true) {
      this.hasBack = true;
    }
    this.photoList.loadPhotos();
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  next(event: any) {
    this.onNext.emit(_.reverse(this.photoList.selectedItems));
  }

  dismiss(event: any): void {
    if (this.hasBack) {
      this.onDismiss.emit(null);
    } else {
      this.photoList.clearSelection();
    }
  }

  chooseFiles(files: any) {
    this.files = files;
    this.onUpload.emit(files);
  }
}
