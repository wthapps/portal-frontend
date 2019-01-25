import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Subject ,  Observable } from 'rxjs';


import { ApiBaseService } from './apibase.service';
import { WthConfirmService } from '../shared/components/confirmation/wth-confirm.service';
import { Photo } from '../shared/models/photo.model';
import { BaseEntityService } from '@wth/shared/services';
// import { BaseEntityService } from '@wth/shared/services';

declare var _: any;

@Injectable()
export class PhotoService {
  url = 'media/photos';

  closePreview$: Observable<any>;
  modifiedPhotos$: Observable<any>;
  private closePreviewSubject: Subject<any> = new Subject();
  private modifiedPhotosSubject: Subject<any> = new Subject(); // including UPDATED and DELETED photos

  constructor(
    protected apiBaseService: ApiBaseService,
    private wthConfirmService: WthConfirmService
  ) {
    // super(apiBaseService);
    this.closePreview$ = this.closePreviewSubject.asObservable();
    this.modifiedPhotos$ = this.modifiedPhotosSubject.asObservable();
  }

  closePreviewModal() {
    this.closePreviewSubject.next('');
  }

  setModifiedPhotos(
    options: any = { action: null, payload: { post_id: null, photo: null } }
  ) {
    console.log ('photo service - setModifiedPhotos: ', options);
    this.modifiedPhotosSubject.next(options);
  }

  listPhoto(body: any = {}): Observable<any> {
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
    const body = {
      ids: [item.id],
      setFavourite: item.favorite ? false : true
    };
    return this.apiBaseService.post(`${this.url}/favourite`, body);
  }

  actionAllFavourite(items: any, setFavourite: boolean) {
    const body = {
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

  confirmUpdate(photo: Photo, payload: any): Promise<any> {
    return new Promise<any>((resolve: any) => {
      this.wthConfirmService.confirm({
        message:
          'Are you sure to save the photo?\nThis photo will replace current photo!',
        header: 'Save Photo',
        accept: () => {
          const {id, content_type} = photo;
          const model = content_type.startsWith('image') ? 'Media::Photo' :
          content_type.startsWith('video') ? 'Media::Video' : null;
          return this.update({
            id,
            model,
            content_type,
            file: payload
          })
            .toPromise()
            .then((response: any) => {
              // this.setModifiedPhotos({action: 'update', payload: {post_uuid: this.post_uuid, photo: this.photo}});
              resolve(response.data);
            });
        }
      });
    });
  }

  confirmDelete(photo: Photo, payload: any): Promise<any> {
    // Ask for user confirmation before deleting selected PHOTOS
    return new Promise<any>((resolve: any) => {
      this.wthConfirmService.confirm({
        header: 'Delete photo',
        message: `Are you sure to delete photo ${photo.name} ?`,
        accept: () => {
          const body = JSON.stringify({ ids: [photo.id] });
          this.deletePhoto(body)
            .toPromise()
            .then((res: any) => {
              resolve(photo);
            });
        },
        reject: () => {
          // Ask for user confirmation before deleting selected ALBUMS
        }
      });
    });
  }
}
