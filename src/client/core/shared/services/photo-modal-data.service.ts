import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
// This Data service is created for communitication between photo select component and its containers
export class PhotoModalDataService {
  // Observable string sources
  private modalOpenSource = new Subject<string>();
  private modalNextSource = new Subject<string>();
  private modalCloseSource = new Subject<string>();
  private modalChooseFilesSource = new Subject<string>();
  private modalUploadSource = new Subject<string>();
  private modalSaveSource = new Subject<string>();
  private modalDismissSource = new Subject<string>();
  private modalInitSource = new Subject<string>();

  // Observable string streams
  openObs$ = this.modalOpenSource.asObservable();
  closeObs$ = this.modalCloseSource.asObservable();
  nextObs$ = this.modalNextSource.asObservable();
  chooseFilesObs$ = this.modalChooseFilesSource.asObservable();
  uploadObs$ = this.modalUploadSource.asObservable();
  saveObs$ = this.modalSaveSource.asObservable();
  dismissObs$ = this.modalDismissSource.asObservable();
  initObs$ = this.modalInitSource.asObservable();

  init() {
    this.modalInitSource.next('');
  }

  open(options: any = {return: false}) {
    this.modalOpenSource.next(options);
  }

  upload(files: any) {
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

