import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal.module';
import { SoPhotoListComponent } from './index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-photo-select',
  templateUrl: 'post-photo-select.component.html'
})

export class PostPhotoSelectComponent implements OnInit {
  @ViewChild('modal') modal: HdModalComponent;
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


  constructor() {
  }

  ngOnInit(): void {

  }

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
