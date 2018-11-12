// import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';

// import { BsModalComponent } from 'ng2-bs3-modal';
// import { Subscription } from 'rxjs/Subscription';

// import { PhotoModalDataService } from '../../../../services/photo-modal-data.service';
// import { FileSelectListComponent } from '../file-select-list/file-select-list.component';
// import { CommonEventService } from '../../../../services/common-event/common-event.service';

// declare var _: any;

// @Component({
//     selector: 'h-file-select',
//   templateUrl: 'file-select.component.html'
// })

// export class FileSelectComponent implements OnInit, OnDestroy {
//   @ViewChild('modal') modal: any;
//   @ViewChild('photoList') photoList: FileSelectListComponent;
//   @Input() selectedItems: Array<any>;
//   @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();
//   @Output() event: EventEmitter<any> = new EventEmitter<any>();
//   action: string = 'Done';

//   postPhotos: Array<any> = new Array<any>();
//   uploadPhotos: Array<any> = new Array<any>();
//   hasBack: boolean = false;
//   files: Array<any> = new Array<any>();
//   editCurrentMode: boolean = false;

//   // Subscription list
//   initSubscription: Subscription;
//   openSubscription: Subscription;
//   closeSubscription: Subscription;

//   constructor(private photoDataService: PhotoModalDataService,
//               private commonEventService: CommonEventService) {
//   }

//   doAction(options: any) {
//     this.event.emit(options);
//   }

//   ngOnInit(): void {
//     this.initSubscription = this.photoDataService.initObs$.subscribe((options: any) => {
//         this.init(options);
//       }
//     );

//     this.openSubscription = this.photoDataService.openObs$.subscribe(
//       (options: any) => {
//         console.log('open: options: ', options);
//         this.open(options);
//       }
//     );
//   }

//   ngOnDestroy() {
//     this.unsubscribeAll([this.initSubscription, this.openSubscription, this.closeSubscription]);
//   }

//   init(options: any) {
//     if (_.get(options, 'multipleSelect', true) === true)
//       this.photoList.multipleSelect = true;
//     else
//       this.photoList.multipleSelect = false;
//   }

//   open(options: any = {return: false}) {
//     if (options.return == true) {
//       this.hasBack = true;
//     }

//     this.editCurrentMode = _.get(options, 'editCurrentMode') == true;

//     if (_.get(options, 'multipleSelect', true) === true && !this.editCurrentMode)
//       this.photoList.multipleSelect = true;
//     else
//       this.photoList.multipleSelect = false;

//     this.photoList.loadPhotos();
//     this.modal.open().then();
//     this.modal.element.nativeElement.style.display = 'inline';
//   }

//   close() {
//     this.photoDataService.close();
//     this.modal.close().then();
//   }

//   next(event: any) {
//     console.log('Post Photo Select Component CLOSED', this.photoList.selectedItems);
//     this.doAction({action: 'photoSelectNext', params: {data: _.reverse(this.photoList.selectedItems)}});
//     this.photoDataService.next(_.reverse(this.photoList.selectedItems));
//     this.close();
//   }

//   dismiss(event: any): void {
//     console.log('Post Photo Select Component DISMISSED', this.hasBack);
//     if (this.hasBack) {
//       this.doAction({action: 'photoSelectDismissed', params: {}}); // what does it do here ???
//       this.photoDataService.dismiss(null);
//     } else {
//       this.photoList.clearSelection();
//     }
//   }

//   onEditCurrentImage() {
//     this.commonEventService.broadcast({channel: 'SELECT_CROP_EVENT', action: 'SELECT_CROP:EDIT_CURRENT'})
//     this.close();
//   }

//   // onImageClicked(img: any): void {
//   //   console.debug('inside onImageClicked: ', img);
//   //   this.photoDataService.upload([img]);
//   // }

//   chooseFiles(files: any[]) {
//     this.files = files;
//     this.doAction({action: 'photoSelectUpload', params: {data: files}});
//     this.photoDataService.upload(files);
//     this.close();
//   }

//   private unsubscribeAll(subs: Array<Subscription>) {
//     _.each(subs, (s: Subscription) => {
//       if (s) s.unsubscribe();
//     });
//   }

// }
