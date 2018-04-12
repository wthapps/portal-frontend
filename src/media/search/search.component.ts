import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import * as appStore from '../shared/store';
import {
  Favorite,
  AddSuccess,
  DeleteMany,
  Search
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { MediaActionHandler } from '@media/shared/media';


@Component({
  moduleId: module.id,
  selector: 'me-search',
  templateUrl: 'search.component.html'
})
export class ZMediaSearchComponent extends MediaActionHandler implements OnInit {
  objects$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;
  type = 'all';
  path = 'media/search';
  returnUrl = '';
  sub: any;
  query = null;
  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService,
    private route: ActivatedRoute
  ) {
    super(resolver, store);

    this.objects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    this.sub = this.route.queryParams.subscribe((params: any) => {
      this.query = params['q'];
      if (this.query) {
        this.doEvent({ action: 'search', payload: {path: 'media/search', queryParams: {q: this.query}}});
      }
    });
  }

  doEvent(event: any) {
    super.doEvent(event);

    switch (event.action) {
      case 'search':
        this.store.dispatch(new Search({...event.payload}));
        break;
      case 'sort':
        this.store.dispatch(new Search({path: this.path, queryParams: {q: this.query, ...event.payload.queryParams}}));
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
      case 'preview':
        this.preview(event.payload);
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete photo',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} photos`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
      case 'goBack':
        if (this.returnUrl === '') {
          history.back();
          return;
        }
        this.router.navigate([this.returnUrl]);
        break;
    }
  }

  preview(payload: any) {
    const objects = payload.selectedObjects;
    const ids = _.map(objects, 'id');

    this.router.navigate([{
        outlets: {
          modal: [
            'photos',
            objects[0].id,
            {ids: ids, mode: 0}
          ]
        }
      }], {queryParamsHandling: 'preserve', preserveFragment: true}
    );
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    if (object.object_type === 'album') {
      this.router.navigate(['albums', object.id], {queryParams: {returnUrl: this.router.url}});
    } else {
      this.router.navigate([{
          outlets: {
            ['modal']: [
              `photos`,
              object.id,
              {ids: [object.id], mode: 0}
            ]
          }
        }], {queryParamsHandling: 'preserve', preserveFragment: true}
      );
    }
  }
}
