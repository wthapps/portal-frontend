import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import { ApiBaseService } from '@wth/shared/services';
import { TaggingElComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-el.component';
import { ZMediaTaggingService } from '@wth/shared/shared/components/photo/modal/tagging/tagging.service';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';


declare var $: any;
declare var _: any;

@Component({
  selector: 'media-create-modal',
  templateUrl: 'media-create-modal.component.html'
})
export class MediaCreateModalComponent implements OnInit {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: Array<any>;

  @ViewChild('modal') modal: any;
  form: FormGroup;
  name: AbstractControl;
  description: AbstractControl;

  isChanged: boolean = false;
  tagItems: any;
  title: any;
  namePlaceholder: any;

  arrayItems: Array<any> = [];

  constructor(private apiBaseService: ApiBaseService,
              private fb: FormBuilder,
              private mediaCreateModalService: MediaCreateModalService
            ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'name': "",
      'description': ""
    });
    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];

    this.mediaCreateModalService.onOpen$.subscribe(e => {
      this.open(e)
    })
    this.mediaCreateModalService.onClose$.subscribe(e => {
      this.close(e)
    })
  }

  open(options: any = {}) {
    this.modal.open().then();
    if(options) {
      ({title: this.title, namePlaceholder: this.namePlaceholder, selectedObjects: this.arrayItems} = options);
    }
    this.form.setControl('edit', this.name);
  }

  close(options?: any) {
    this.modal.close().then();
  }

  create(e: any) {
    // this.apiBaseService.post(`media/playlists`, {playlist: e, videos: this.arrayItems}).subscribe(res => {
    //   this.modal.close().then();
    //   this.mediaCreateModalService.created.next(res.data);
    // });
    this.mediaCreateModalService.create.next({parents: [e], children: this.arrayItems});
  }

  onAction(action: string, data: any) {
    let options = {action: action, data: data};
    this.event.emit(options);
  }

  remove(photo: any, event: any): void {
    _.remove(this.arrayItems, (p: any) => p.id == photo.id);
  }

  onAddItems(arrayItems: Array<number>) {
    this.isChanged = true;
    this.arrayItems = arrayItems;
  }
}
