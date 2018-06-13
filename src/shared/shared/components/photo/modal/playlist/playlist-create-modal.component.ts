import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { ApiBaseService } from '@wth/shared/services';
import { TaggingElComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-el.component';
import { ZMediaTaggingService } from '@wth/shared/shared/components/photo/modal/tagging/tagging.service';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';


declare var $: any;
declare var _: any;

@Component({
  selector: 'playlist-create-modal',
  templateUrl: 'playlist-create-modal.component.html'
})
export class PlaylistCreateModalComponent implements OnInit {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: Array<any>;

  @ViewChild('modal') modal: any;
  @ViewChild('tag') tag: TaggingElComponent;
  form: FormGroup;
  name: AbstractControl;
  tags: AbstractControl;
  description: AbstractControl;

  isChanged: boolean = false;
  tagItems: any;

  arrayItems: Array<any> = [];
  album: any;

  constructor(private apiBaseService: ApiBaseService,
              private fb: FormBuilder,
              private router: Router,
              private playlistCreateModalService: PlaylistCreateModalService,
              private tagService: ZMediaTaggingService) {
  }

  ngOnInit() {
    this.album = {};
    this.form = this.fb.group({
      'name': "",
      'description': "",
      'tags': [],
    });
    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];
    this.tags = this.form.controls['tags'];

    this.playlistCreateModalService.events$.subscribe(e => {
      switch (e.action) {
        case 'open':
          this.open(e.payload)
          break;
      }
    })
  }

  open(options: any = {}) {
    this.modal.open().then();
    // this.modal.addClass({display: 'inline'});
    if(options.selectedObjects) {
      this.arrayItems = options.selectedObjects;
    }
  }

  close(options?: any) {
    this.modal.close().then();
    // this.modal.removeClass({display: 'inline'});
  }

  create(e: any) {
    this.apiBaseService.post(`media/playlists`, {playlist: e, videos: this.arrayItems}).subscribe(res => {
      this.modal.close().then();
    });
  }

  viewAlbumDetail(albumId: number) {
    this.router.navigate(['albums', albumId], {queryParams: {returnUrl: this.router.url}});
  }

  onAction(action: string, data: any) {
    let options = {action: action, data: data};
    this.event.emit(options);
  }

  autoCompleteTags = (text: string): Observable<any> => {
    return this.tagService.getTags(text)
      .map(data => data.json().map((item: any) => item.name))
      .do(console.log);
  }

  remove(photo: any, event: any): void {
    _.remove(this.arrayItems, (p: any) => p.id == photo.id);
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
