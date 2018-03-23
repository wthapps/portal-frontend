import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { AlbumService } from '../shared/services/album.service';
import * as fromAlbum from '../shared/store/album/album.action';
import * as appStore from '../shared/store';
import { Constants } from '@wth/shared/constant';
import { MediaObjectService } from '@media/shared/container/media-object.service';

@Component({
  selector: 'z-media-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album-detail.component.scss']
})
export class ZMediaAlbumDetailComponent implements OnInit {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;

  album: any;
  params: any;
  showDetail: boolean;
  modalComponent: any;
  modal: any;

  photos: Observable<any>;
  tooltip: any = Constants.tooltip;

  constructor(
    private store: Store<appStore.State>,
    private resolver: ComponentFactoryResolver,
    private mediaObjectService: MediaObjectService,
    private router: Router,
    private route: ActivatedRoute,
    private albumService: AlbumService) {
    this.photos = this.store.select(appStore.selectPhotosOfAlbum);
  }

  ngOnInit() {

    this.route.params
      .switchMap((params: Params) => {
        this.params = params;
        this.showDetail = params['showDetail'] || false;
        return this.albumService.getAlbum(params['id']); })
        .subscribe((res: any) => {
          this.album = res.data;
          this.store.dispatch(new fromAlbum.GetPhotos(this.album));
        });
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action);

    switch (event.action) {
      case 'loadMore':
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
        // this.mediaUploaderDataService.onShowUp();
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
        this.editName(event.params);
        break;
    }
  }

  openModal(payload: any) {
    let options: any;
    switch (payload.modalName) {
      // case 'createAlbumModal':
      //   this.loadModalComponent(AlbumCreateModalComponent);
      //   options = {selectedObjects: []};
      //   break;
      // case 'editNameModal':
      //   this.loadModalComponent(BaseObjectEditNameModalComponent);
      //   options = {selectedObject: payload.selectedObject};
      //   break;
      // case 'sharingModal':
      //   this.loadModalComponent(SharingModalComponent);
      //   var objects = _.get(payload, 'selectedObjects', []).concat([]);
      //   options = {selectedObjects: objects, updateListObjects: payload.updateListObjects};
      //   break;
      // case 'taggingModal':
      //   this.loadModalComponent(TaggingModalComponent);
      //   if (payload.object) {
      //     options = {selectedObjects: []};
      //   } else {
      //     options = {selectedObjects: []};
      //   }
      //   break;
      // case 'deleteModal':
      //   this.loadModalComponent(AlbumDeleteModalComponent);
      //   options = {selectedObjects: payload.selectedObjects};
      //   break;
      // default:
      //   break;
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
    this.router.navigate([{outlets: {detail: ['albums', payload.selectedObject.id]}}], {
      queryParamsHandling: 'preserve',
      preserveFragment: true
    });
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
