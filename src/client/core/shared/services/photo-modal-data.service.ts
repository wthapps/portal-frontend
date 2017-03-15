import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
// This Data service is created for communitication between photo select component and its containers
export class PhotoModalDataService {

  // Observable string streams
  openObs$ : any;
  closeObs$ : any;
  nextObs$ : any;
  chooseFilesObs$  : any;
  uploadObs$  : any;
  saveObs$  : any;
  dismissObs$  : any;
  initObs$  : any;

  // Observable string sources
  private modalOpenSource = new Subject<string>();
  private modalNextSource = new Subject<string>();
  private modalCloseSource = new Subject<string>();
  private modalChooseFilesSource = new Subject<string>();
  private modalUploadSource = new Subject<string>();
  private modalSaveSource = new Subject<string>();
  private modalDismissSource = new Subject<string>();
  private modalInitSource = new Subject<string>();

  constructor() {
    this.openObs$ = this.modalOpenSource.asObservable();
    this.closeObs$ = this.modalCloseSource.asObservable();
    this.nextObs$ = this.modalNextSource.asObservable();
    this.chooseFilesObs$ = this.modalChooseFilesSource.asObservable();
    this.uploadObs$ = this.modalUploadSource.asObservable();
    this.saveObs$ = this.modalSaveSource.asObservable();
    this.dismissObs$ = this.modalDismissSource.asObservable();
    this.initObs$ = this.modalInitSource.asObservable();
  }


  init() {
    this.modalInitSource.next('');
  }

  open(options: any = {return: false}) {
    this.modalOpenSource.next(options);
  }

  upload(files: any) {
    console.log('photo modal uploading ...');
    this.modalUploadSource.next(files);
  }

  next(items: any) {
    this.modalNextSource.next(items);
  }

  dismiss(event: any): void {
    this.modalDismissSource.next(event);
  }

  chooseFiles(files: any) {
    // this.modalChooseFilesSource.next(files);
    this.modalChooseFilesSource.next(files);
  }

  close() {
    this.modalCloseSource.next('');
  }

}

