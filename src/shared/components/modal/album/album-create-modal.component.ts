import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

import { ApiBaseService } from '@wth/shared/services';
import { ModalService } from '@shared/components/modal/modal-service';
import { TaggingElComponent } from '@shared/modules/photo/components/modal/tagging/tagging-el.component';
import { ZMediaTaggingService } from '@shared/modules/photo/components/modal/tagging/tagging.service';


declare var $: any;
declare var _: any;

@Component({
  selector: 'album-create-modal',
  templateUrl: 'album-create-modal.component.html',
  styleUrls: ['album-create-modal.component.scss']
})
export class AlbumCreateModalComponent implements OnInit, OnDestroy {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @Input() items: Array<any>;


  @ViewChild('modal') modal: any;
  @ViewChild('tag') tag: TaggingElComponent;
  form: FormGroup;
  descCtrl: AbstractControl;
  tagsCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  isChanged = false;
  tagItems: any;

  arrayItems: Array<number> = [];
  album: any;
  selectedPhotos: any;
  private destroy$ = new Subject();

  constructor(private api: ApiBaseService,
    private fb: FormBuilder,
    private router: Router,
    private tagService: ZMediaTaggingService,
    private modalService: ModalService) {
    // super('form-create-album-modal');
  }

  ngOnInit() {

    this.album = {};
    this.form = this.fb.group({
      // 'description': [this.post.description, null],
      'tags': [this.album.tags],
      // 'photos': [this.post.photos, null]
    });
    this.descCtrl = this.form.controls['description'];
    this.tagsCtrl = this.form.controls['tags'];
    this.photosCtrl = this.form.controls['photos'];

    this.modalService.open$.pipe(takeUntil(this.destroy$)).subscribe(payload => {
      if (payload.modalName === 'createAlbumModal') {
        this.open(payload);
      }
    });
  }

  open(options?: any) {
    // Get selected photo object list
    this.selectedPhotos = _.filter(options.selectedObjects, { 'object_type': 'Media::Photo' });
    this.modal.open().then();
    this.modal.element.nativeElement.style.display = 'inline';

  }

  close(options?: any) {
    this.modal.close(options);
    $('div.modal-backdrop.in.modal-stack').remove();
  }

  createAlbum() {
    let albumName = $('#album-name').val();
    const albumDes = $('#album-description').val();
    if (albumName.length === 0) {
      albumName = 'Untitled Album';
    }
    const selectedPhotosId = _.map(this.selectedPhotos, 'id');

    const tagsName = [];
    for (let i = 0; i < this.tag.addedTags.length; i++) {
      if (typeof this.tag.addedTags[i] === 'object') {
        tagsName.push(this.tag.addedTags[i].display);
      } else {
        tagsName.push(this.tag.addedTags[i]);
      }
    }
    const album = { name: albumName, description: albumDes, photos: selectedPhotosId, tags_name: tagsName };
    // Only subscribe to this observable once
    this.close(null);
    this.api.post(`media/albums`, album)
      .toPromise().then((res: any) => {
        this.album = res.data;
        this.doneFormModal.emit(this.album);
        this.event.emit({ action: 'addAlbumSuccessful', payload: res });
        this.viewAlbumDetail(this.album.uuid);
        this.close();
      });
  }

  viewAlbumDetail(albumId: number): Promise<any> {
    return this.router.navigate(['albums', albumId], { queryParams: { returnUrl: this.router.url } });
  }

  onAction(action: string, data: any) {
    const options = { action: action, data: data };
    this.event.emit(options);
  }

  autoCompleteTags = (text: string): Observable<any> => {
    return this.tagService.getTags(text)
      .pipe(
        map((data: any) => data.json(),
          map((item: any) => item.name)),
        tap(console.log)
      );
  }

  removePhoto(photo: any, event: any): void {
    _.remove(this.selectedPhotos, (p: any) => p.id === photo.id);
  }


  removeTag(tag: any) {
    this.album.tags = _.pull(this.album.tags, _.find(this.album.tags, ['name', tag]));
  }


  addTag(event: any) {
  }

  onAddItems(arrayItems: Array<number>) {
    this.isChanged = true;
    this.arrayItems = arrayItems;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
