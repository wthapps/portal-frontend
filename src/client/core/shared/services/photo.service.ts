import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiBaseService } from './apibase.service';
import { Observable } from 'rxjs/Observable';

declare var _: any;

@Injectable()
export class PhotoService {

  url = 'media/photos';

  previewPhotos$: Observable<any[]>;
  private previewPhotosSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private apiBaseService: ApiBaseService) {
    this.previewPhotos$ = this.previewPhotosSubject.asObservable();
  }

  clearPreviewPhotos() {
    this.setPreviewPhotos([]);
  }

  setPreviewPhotos(photos: any[]): void {
    this.previewPhotosSubject.next(photos);
  }

  getPreviewPhotos() {
    return this.previewPhotosSubject.getValue();
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
    // let body = JSON.stringify({
    //   ids: [item.id],
    //   setFavourite: (item.favorite) ? false : true
    // });
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
