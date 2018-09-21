import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';

import { ApiBaseService, CommonEventService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ModalComponent } from '@shared/shared/components/base/components';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { PlaylistCreateModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.component';
import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';
declare var $: any;
declare var _: any;

@Mixins([LoadModalAble])
@Component({
  selector: 'playlist-modal',
  templateUrl: 'playlist-modal.component.html',
  entryComponents: [
    PlaylistCreateModalComponent
  ],
  styleUrls: ['playlist-modal.component.scss']
})
export class PlaylistModalComponent implements OnInit, ModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  filteredContacts: any = [];
  selectedContacts: any = [];
  selectedObjects: any = [];
  sharedContacts: any = [];
  playlists: any = [];
  hasChanged: boolean;
  deleting: boolean;
  nextLink: any;
  showToast: boolean;

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiBaseService: ApiBaseService,
    public playlistModalService: PlaylistModalService,
    public playlistCreateModalService: PlaylistCreateModalService,
    public resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.playlistModalService.onOpen$.subscribe(e => {
      this.open(e);
    })
  }


  close() {
    this.modal.close().then();
  }

  save() {
    this.onSave.emit(this.selectedContacts);
    this.modal.close().then();
  }

  open(options?: any) {
    this.getPlaylist();
    if(options.selectedObjects) {
      this.selectedObjects = options.selectedObjects;
    }
    this.modal.open().then();
  }

  complete(e: any) {
    let body: any;
    body = {'q': (e.query === 'undefined' ? '' : 'name:' + e.query)};
    this.apiBaseService.get('media/sharings/recipients', body).subscribe(res => {
      const selectedContactIds = this.selectedContacts.map(ct => ct.id);
      const sharedContactIds = this.sharedContacts.map(sc => sc.id);
      this.filteredContacts = res['data'].filter(ct => !selectedContactIds.includes(ct.id) && !sharedContactIds.includes(ct.id));
    });
  }

  selectContact(contact: any) {
    this.selectedContacts.push(contact);
    this.hasChanged = true;
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
  }

  getPlaylist() {
    this.apiBaseService.get('media/playlists').subscribe((res) => {
      this.playlists = res.data;
    });
  }


  add(data: any) {
    // short distance
    this.onAdd.emit(data);
    // long distance
    this.playlistModalService.add.next(data);
    this.modal.close().then();
  }

  onCreateNew() {
    this.modal.close().then();
    this.playlistCreateModalService.open.next({selectedObjects: this.selectedObjects});
  }
}
