import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ZMediaTaggingService } from './tagging/tagging.service';
import { TaggingElComponent } from './tagging/tagging-el.component';
import { ApiBaseService } from '../../../services/apibase.service';
import { WthAppsBaseModal } from '../../../interfaces/base-media-modal';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'album-create-modal',
  templateUrl: 'album-create-modal.component.html',
  styleUrls: ['album-create-modal.component.css']
})
export class AlbumCreateModalComponent implements OnInit {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  @Input() items: Array<any>;


  @ViewChild('modal') modal: ModalComponent;
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
    console.log('Photos loaded to album create component: ', this.selectedPhotos);
    this.modal.open().then((res: any) => console.log('Album create modal opened, options', res));
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
    // this.albumService.create(album)
    //   .take(1)
    //   .subscribe((res: any) => {
    //     this.album = new Album(res.data);
    //     this.doneFormModal.emit(this.album);
    //
    //     let retPhotos = _.get(res, 'data.photo_number', 0);
    //     // if(retPhotos > 0) {
    //       // let albumPhotos = new AlbumPhoto({album: this.album, photos: retPhotos});
    //       // this.doneFormModal.emit(albumPhotos);
    //     // }
    //     console.log('A new album is created: ', this.album);
    //
    //     // this.onAction('showNewAlbum', this.album);
    //     this.viewAlbumDetail(this.album.id );
    //
    //     this.modal.close().then((res: any) => console.log('Album create modal should close now'));
    //
    //
    //   });
  }

  public viewAlbumDetail(albumId: number) {
    this.router.navigate([`/albums`, albumId]);
  }

  public onAction(action: string, data: any) {
    let options = {action: action, data: data};
    this.event.emit(options);
  }

  public autoCompleteTags = (text: string): Observable<Response> => {
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
    console.debug('Removed photo id: ', photo.id);
  }


  removeTag(tag: any) {

    this.album.tags = _.pull(this.album.tags, _.find(this.album.tags, ['name', tag]));
    console.log('tag remove', tag, this.album.tags);
  }


  addTag(event: any) {
    console.log('add tag');
  }

  onAddItems(arrayItems: Array<number>) {
    this.isChanged = true;
    this.arrayItems = arrayItems;
  }
}
