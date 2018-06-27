import {Component, ComponentFactoryResolver, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  Update,
  AddSuccess,
  DeleteMany,
  Download
} from '../shared/store/media/media.actions';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ApiBaseService } from '@shared/services';

@Component({
  selector: 'me-sharings',
  templateUrl: 'sharing-list.component.html'
})
export class ZMediaSharingListComponent extends MediaActionHandler implements OnInit, OnDestroy {
  sharings$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  objects: any;
  hasSelectedObjects: any;
  selectedObjects: any;
  favoriteAll: any;
  subShareModal: any;

  tooltip: any = Constants.tooltip;

  private path = 'media/sharings';

  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private sharingModalService: SharingModalService,
    private apiBaseService: ApiBaseService,
    private router: Router,
    private confirmService: WthConfirmService,
    private sharingService: SharingService
  ) {
    super(resolver, store);

    this.sharings$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);

    this.sub = this.mediaUploaderDataService.action$
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }

  ngOnInit() {
    this.apiBaseService.get('media/sharings').subscribe(res => {
      this.objects = res.data;
    })
  }

  doEvent(event: any) {
    super.doEvent(event);

    switch (event.action) {
      case 'sort':
        this.store.dispatch(new GetAll({path: this.path, queryParams: {...event.payload.queryParams}}));
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new Favorite(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: event.payload.header || 'Delete sharing',
          acceptLabel: 'Delete',
          message: event.payload.message || `Are you sure to delete ${event.payload.selectedObjects.length} sharing(s)`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
      case 'download':
        this.sharingService.get(event.payload.selectedObjects[0].id).subscribe(response => {
          this.store.dispatch(new Download({selectedObjects: response.data}));
        });
        break;
    }
  }

  openModalSharing() {
    if(this.subShareModal) this.subShareModal.unsubscribe();
    this.sharingModalService.open.next();
    this.apiBaseService.get(`media/sharings/recipients`, {id: this.selectedObjects[0].id}).subscribe(res => {
      this.sharingModalService.open.next({sharingRecipients: res.data});
    });
    this.subShareModal = this.sharingModalService.onSave$.take(1).subscribe(e => {
      this.apiBaseService.post('media/sharings/edit_recipients', {id: this.selectedObjects[0].id, role_id: e.role.id, recipients: e.sharingRecipients, user: e.selectedContacts}).subscribe(res => {
        console.log(res);
      })
    })
  }

  selectedObjectsChanged(e: any) {
    this.hasSelectedObjects = true;
    if (e && e.length == 0) this.hasSelectedObjects = false;
    this.objects = this.objects.map(v => {
      if (e.some(ob => ob.id == v.id)) {
        v.selected = true;
      } else {
        v.selected = false;
      }
      return v;
    })
    this.selectedObjects = this.objects.filter(v => v.selected == true);
    this.favoriteAll = this.selectedObjects.every(s => s.favorite);
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    this.router.navigate(['shared', object.uuid], {queryParams: {returnUrl: this.router.url}});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
