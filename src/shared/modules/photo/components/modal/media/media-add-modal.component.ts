import { Component, ViewChild, Output, EventEmitter, ComponentFactoryResolver, OnInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { PlaylistCreateModalComponent } from '../playlist/playlist-create-modal.component';
import { MediaAddModalService } from './media-add-modal.service';
import { MediaCreateModalService } from './media-create-modal.service';

@Mixins([LoadModalAble])
@Component({
  selector: 'media-add-modal',
  templateUrl: 'media-add-modal.component.html',
  entryComponents: [
    PlaylistCreateModalComponent
  ],
  styleUrls: ['media-add-modal.component.scss']
})
export class MediaAddModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  parents: any = [];
  selectedObjects: any = [];
  hasChanged: boolean;
  deleting: boolean;
  nextLink: any;
  showToast: boolean;
  loading: boolean;
  title: string;
  buttonTitle: string;
  unit: string;
  sub: any;

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.mediaAddModalService.onOpen$.subscribe(e => {
      this.open(e);
    });
  }

  close() {
    this.modal.close().then();
  }

  open(options?: any) {
    if (options) {
      ({ title: this.title, buttonTitle: this.buttonTitle, unit: this.unit, selectedObjects: this.selectedObjects } = options);
    }
    if (options && options.getParents) {
      this.loading = true;
      options.getParents.subscribe(res => {
        this.loading = false;
        this.parents = res.data;
      });
    }
    this.modal.open().then();
  }

  add(data: any) {
    // short distance
    this.onAdd.emit(data);
    // long distance
    this.mediaAddModalService.add.next(data);
    this.modal.close().then();
  }

  onCreateNew() {
    this.modal.close().then();
    this.mediaAddModalService.openCreateNew.next();
  }
}
