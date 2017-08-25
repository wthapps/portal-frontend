import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';

import { ApiBaseService } from './apibase.service';

declare var _: any;

@Injectable()
export class PhotoService {

  url = 'media/photos';

  closePreview$: Observable<any>;
  modifiedPhotos$: Observable<any>;
  private closePreviewSubject: Subject<any> = new Subject();
  private modifiedPhotosSubject: BehaviorSubject<any> = new BehaviorSubject({action: null, payload: {}}); // including UPDATED and DELETED photos

  constructor(private apiBaseService: ApiBaseService) {
    this.closePreview$ = this.closePreviewSubject.asObservable();
    this.modifiedPhotos$ = this.modifiedPhotosSubject.asObservable();
  }

  closePreviewModal() {
    this.closePreviewSubject.next('');
  }

  setModifiedPhotos(options: any = {action: null, payload: {post_id: null, photo: null}}) {
    console.debug('photo service - setModifiedPhotos: ', options);
    this.modifiedPhotosSubject.next(options);
  }

  getModifiedPhotos() {
    return this.modifiedPhotosSubject.getValue();
  }

  listPhoto(body: any = {}): any {
    return this.apiBaseService.get(this.url, body);
  }

  getPhoto(id: any): Observable<any> {
    return this.apiBaseService.get(`${this.url}/${id}`);
  }

  create(body: any) {
    return this.apiBaseService.post(`${this.url}`, body);
  }

  update(body: any) {
    return this.apiBaseService.put(`${this.url}/${body.id}`, body);
  }

  download(body: any) {
    return this.apiBaseService.download(`media/files/download`, body);
  }

  actionOneFavourite(item: any) {
    let body = {
      ids: [item.id],
      setFavourite: (item.favorite) ? false : true
    };
    return this.apiBaseService.post(`${this.url}/favourite`, body);
  }

  actionAllFavourite(items: any, setFavourite: boolean) {
    let body = {
      ids: _.map(items, 'id'),
      setFavourite: setFavourite
      // setFavourite: (setFavourite ? true : false) // if there was one item's favorite is false
    };
    return this.apiBaseService.post(`${this.url}/favourite`, body);
  }

  updateInfo(id: number, body: any) {
    return this.apiBaseService.put(`${this.url}/${id}`, body);
  }

  deletePhoto(body: any) {
    return this.apiBaseService.post(`${this.url}/delete`, body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }

}
