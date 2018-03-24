import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as appStore from '../shared/store';
import * as fromAlbum from '../shared/store/album/album.action';
import { BaseObjectEditNameModalComponent } from '@wth/shared/shared/components/photo/modal/base-object-edit-name-modal.component';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AlbumCreateModalComponent, AlbumDeleteModalComponent } from '@media/shared/modal';
import { MediaObjectService } from '@media/shared/container/media-object.service';
import { Constants } from '@wth/shared/constant';
import { AlbumEditModalComponent } from '@wth/shared/shared/components/photo/modal/album-edit-modal.component';
import { AlbumDetailInfoComponent } from '@media/album/album-detail-info.component';


@Component({
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html',
  entryComponents: [
    AlbumCreateModalComponent,
    BaseObjectEditNameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent
  ]
})
export class AlbumListComponent implements OnInit {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  albums: Observable<any>;
  tooltip: any = Constants.tooltip;


  constructor(private store: Store<appStore.State>,
              private resolver: ComponentFactoryResolver,
              private mediaUploaderDataService: MediaUploaderDataService,
              private router: Router,
              private mediaObjectService: MediaObjectService
  ) {
    this.albums = this.store.select(appStore.selectAlbums);
    this.mediaUploaderDataService.action$.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  ngOnInit() {
    this.store.dispatch(new fromAlbum.GetAll());
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action, event.payload);

    switch (event.action) {
      case 'loadMore':
        this.store.dispatch(new fromAlbum.GetAll());
        break;
      case 'select':
        this.store.dispatch(new fromAlbum.Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new fromAlbum.SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(new fromAlbum.Deselect({selectedObjects: event.payload.selectedObjects}));
        break;
      case 'deselectAll':
        this.store.dispatch(new fromAlbum.DeselectAll());
        break;
      case 'openModal':
        this.openModal(event.payload);
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new fromAlbum.AddSuccess(event.payload));
        break;
      case 'favourite':
        this.favourite(event.payload);
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new fromAlbum.Update(event.params.selectedObject));

        // this.editName(event.params);
        break;
    }
  }

  openModal(payload: any) {
    let options: any;
    switch (payload.modalName) {
      case 'createAlbumModal':
        this.loadModalComponent(AlbumCreateModalComponent);
        options = {selectedObjects: []};
        break;
      case 'editNameModal':
        this.loadModalComponent(BaseObjectEditNameModalComponent);
        options = {selectedObject: payload.selectedObject};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        var objects = _.get(payload, 'selectedObjects', []).concat([]);
        options = {selectedObjects: objects, updateListObjects: payload.updateListObjects};
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        if (payload.object) {
          options = {selectedObjects: []};
        } else {
          options = {selectedObjects: []};
        }
        break;
      case 'editInfoModal':
        this.loadModalComponent(AlbumEditModalComponent);
        options = {selectedObject: payload.selectedObject};
        break;
      case 'deleteModal':
        this.loadModalComponent(AlbumDeleteModalComponent);
        options = {selectedObjects: payload.selectedObjects};
        break;
      default:
        break;
    }
    if (this.modal) {
      this.modal.open(options);
    }

  }


  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    this.modal.event.takeUntil(this.destroySubject).subscribe((event: any) => {

      // considering moving doAction into list-media
      this.doEvent(event);
    });
  }

  viewDetails(payload: any) {
    // this.router.navigate([{outlets: {detail: ['albums', payload.selectedObject.id]}}], {
    //   queryParamsHandling: 'preserve',
    //   preserveFragment: true
    // });
    this.router.navigate(['albums', payload.selectedObject.id]);
  }

  editName(payload: any) {

  }

  favourite(payload: any) {
    console.log('do favorite:::', payload);
    let body = {
        objects: _.map(payload.selectedObjects, (object: any) => {
          return _.pick(object, ['id', 'object_type']);
        }),
        mode: payload.mode
      };

    this.mediaObjectService.favourite(body).toPromise()
      .then(
        (response: any) => {
          this.store.dispatch(new fromAlbum.FavoriteSuccess(payload));
        },
        (error: any) => {
          console.log('error: ', error);
        }
      );
  }

  private destroySubject() {

  }
}
