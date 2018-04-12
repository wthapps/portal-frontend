import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { ApiBaseService } from '@wth/shared/services';
import { TaggingElComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-el.component';
import { ZMediaTaggingService } from '@wth/shared/shared/components/photo/modal/tagging/tagging.service';


declare var $: any;
declare var _: any;

@Component({
    selector: 'album-create-modal',
  templateUrl: 'album-create-modal.component.html',
  styleUrls: ['album-create-modal.component.scss']
})
export class AlbumCreateModalComponent implements OnInit {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @Input() items: Array<any>;


  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('tag') tag: TaggingElComponent;
  form: FormGroup;
  descCtrl: AbstractControl;
  tagsCtrl: AbstractControl;
  photosCtrl: AbstractControl;

  isChanged: boolean = false;
  tagItems: any;

  arrayItems: Array<number> = [];
  album: any;
  selectedPhotos: any;

  constructor(private api: ApiBaseService,
              private fb: FormBuilder,
              private router: Router,
              private tagService: ZMediaTaggingService) {
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
  }

  open(options?: any) {
    // Get selected photo object list
    this.selectedPhotos = _.filter(options.selectedObjects, {'object_type' : 'photo'});
    this.modal.open().then();
  }

  close(options?: any) {
    this.modal.close();
  }

  createAlbum() {
    let albumName = $('#album-name').val();
    let albumDes = $('#album-description').val();
    if (albumName.length == 0) {
      albumName = 'Untitled Album';
    }
    let selectedPhotosId = _.map(this.selectedPhotos, 'id');

    let tagsName:any = [];
    for (let i = 0; i < this.tag.addedTags.length; i++) {
      if (typeof this.tag.addedTags[i] == 'object') {
        tagsName.push(this.tag.addedTags[i].display);
      } else {
        tagsName.push(this.tag.addedTags[i]);
      }
    }
    let album:any = {name: albumName, description: albumDes, photos: selectedPhotosId, tags_name: tagsName};
    // Only subscribe to this observable once
    this.api.post(`media/albums`, album)
      .subscribe((res: any) => {
        this.album = res.data;
        this.doneFormModal.emit(this.album);
        this.event.emit({action: 'addAlbumSuccessful', payload: res });
        this.viewAlbumDetail(this.album.id );

        this.modal.close().then();
      });
  }

  viewAlbumDetail(albumId: number) {
    this.router.navigate(['albums', albumId]);
  }

  onAction(action: string, data: any) {
    let options = {action: action, data: data};
    this.event.emit(options);
  }

  autoCompleteTags = (text: string): Observable<any> => {
    return this.tagService.getTags(text)
      // .map(data => { console.log('autocompleteTags: ', data.json()); return data.json().map((t: any) => t.name)})
      .map(data => data.json().map((item: any) => item.name))
      // .do(result => console.log('data: ', result))
      // .map(result => result['data'])
      .do(console.log)
      ;
  }

  removePhoto(photo: any, event: any): void {
    _.remove(this.selectedPhotos, (p: any) => p.id == photo.id);
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
}
