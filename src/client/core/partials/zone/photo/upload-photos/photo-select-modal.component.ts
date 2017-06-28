import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SoPhotoListComponent } from '../photo-list/photo-list.component';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'photo-select',
  templateUrl: 'photo-select-modal.component.html'
})

// PhotoSelectModalComponent is a PostPhotoSelectComponent (DEPRECATED clone with another way to communicate with its invoker: It use event EventEmitter instead of PhotoModalDataService
// Consider replace this component with the DEPRECATED one
export class PhotoSelectModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('photoList') photoList: SoPhotoListComponent;
  @Input() selectedItems: Array<any>;
  action: string = 'NEXT';
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  postPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  hasBack: boolean = false;
  files: Array<any> = new Array<any>();


  constructor() {
  }

  ngOnInit(): void {

  }

  public init() {
    this.action = 'DONE';
    this.photoList.multipleSelect = true;
  };

  doAction(options: any) {
    this.event.emit(options);
  }

  open(options: any = {return: false}) {
    console.log('Post Photo Select Component OPENED');

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
    this.doAction({action: 'photoSelectNext', params: {data: _.reverse(this.photoList.selectedItems)}});
    this.close();
  }

  dismiss(event: any): void {
    if (this.hasBack) {
      this.doAction({action: 'photoSelectDismissed', params: {}}); // what does it do here ???
    } else {
      this.photoList.clearSelection();
    }

    this.close();
  }

  // Currently unused, to be used later
  chooseFiles(files: any) {
    // this.files = files;
    this.doAction({action: 'photoSelectUpload', params: {data: files}});
    this.close();
  }
}
