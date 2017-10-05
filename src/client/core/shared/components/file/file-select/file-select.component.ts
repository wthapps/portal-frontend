import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Subscription } from 'rxjs/Subscription';

import { PhotoModalDataService } from '../../../services/photo-modal-data.service';
import { FileSelectListComponent } from '../file-select-list/file-select-list.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'h-file-select',
  templateUrl: 'file-select.component.html'
})

export class FileSelectComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('photoList') photoList: FileSelectListComponent;
  @Input() selectedItems: Array<any>;
  @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  action: string = 'Done';

  postPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  hasBack: boolean = false;
  files: Array<any> = new Array<any>();

  // Subscription list
  initSubscription: Subscription;
  openSubscription: Subscription;
  closeSubscription: Subscription;

  constructor(private photoDataService: PhotoModalDataService) {
  }

  doAction(options: any) {
    this.event.emit(options);
  }

  ngOnInit(): void {

    this.initSubscription = this.photoDataService.initObs$.subscribe((options: any) => {
        this.init(options);
      }
    );

    this.openSubscription = this.photoDataService.openObs$.subscribe(
      (options: any) => {
        console.log('open: options: ', options);
        this.open(options);
      }
    );

    // this.closeSubscription = this.photoDataService.closeObs$.subscribe(
    //   () => { this.close(); }
    // );

  }

  ngOnDestroy() {
    this.unsubscribeAll([this.initSubscription, this.openSubscription, this.closeSubscription]);
  }

  init(options: any) {
    if (_.get(options, 'multipleSelect', true) === true)
      this.photoList.multipleSelect = true;
    else
      this.photoList.multipleSelect = false;
  }

  open(options: any = {return: false}) {
    if (options.return == true) {
      this.hasBack = true;
    }
    if (_.get(options, 'multipleSelect', true) === true)
      this.photoList.multipleSelect = true;
    else
      this.photoList.multipleSelect = false;

    this.photoList.loadPhotos();
    this.modal.open().then();
  }

  close() {
    this.modal.close().then();
  }

  next(event: any) {
    console.log('Post Photo Select Component CLOSED', this.photoList.selectedItems);
    this.doAction({action: 'photoSelectNext', params: {data: _.reverse(this.photoList.selectedItems)}});
    this.photoDataService.next(_.reverse(this.photoList.selectedItems));
    this.close();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', this.hasBack);
    if (this.hasBack) {
      this.doAction({action: 'photoSelectDismissed', params: {}}); // what does it do here ???
      this.photoDataService.dismiss(null);
    } else {
      this.photoList.clearSelection();
    }
  }

  chooseFiles(files: any) {
    this.files = files;
    this.doAction({action: 'photoSelectUpload', params: {data: files}});
    this.close();
    this.photoDataService.upload(files);
  }

  private unsubscribeAll(subs: Array<Subscription>) {
    _.each(subs, (s: Subscription) => {
      if (s) s.unsubscribe();
    });
  }

}
