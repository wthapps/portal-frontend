
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BsModalComponent } from 'ng2-bs3-modal';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { WUploader } from '@shared/services/w-uploader';
import Media from '@shared/modules/photo/models/media.model';

@Component({
  selector: 'w-media-selection',
  templateUrl: 'w-media-selection.component.html',
  styleUrls: ['w-media-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WMediaSelectionComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  // @Output() onInsertEvent: EventEmitter<any> = new EventEmitter<any>();

  tabs: WTab[] = [
    {
      name: 'Upload',
      link: 'upload',
      icon: 'fa fa-cloud-upload',
      number: null,
      type: 'tab'
    },
    {
      name: 'Photos',
      link: 'photos',
      icon: 'fa fa-photo',
      number: null,
      type: 'tab'
    },
    {
      name: 'Albums',
      link: 'albums',
      icon: 'wthico-album',
      number: null,
      type: 'tab'
    },
    {
      name: 'Favourites',
      link: 'favourites',
      icon: 'fa fa-star',
      number: null,
      type: 'tab'
    }
  ];

  medias$: Observable<Media[]>;
  tabsFilter: any = [];
  mediaParent: Media;
  selectedMedias$: Observable<Media[]>;
  multipleSelection$: Observable<boolean>;
  view$: Observable<string>;
  initLoading = true;
  sortName = 'created_at';
  sortDirection = 'desc';

  currentTab: string; // upload, photos, albums, albums_detail, favourites
  readonly tabNameMap = {
    photos: 'Photos',
    albums: 'Albums',
    albums_detail: '',
    favourites: 'Favourites'
  };

  nextLink: string;
  isLoading: boolean;

  dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: null, // 1
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };
  dropzoneDisabled: Boolean = false;

  // search
  searchShow: Boolean = false;
  searchText: string;

  // end search

  allowCancelUpload: boolean;
  uploadButtonText: string;
  dragdropText: string;
  filter: 'all' | 'photo' | 'video' = 'all';
  subFilter: 'photo' | 'album' = 'photo';

  private allowedFileTypes: any;
  private beforeCallBackUrl: any;
  private afterCallBackUrl: any;
  private payload: any;
  private options;
  private sub: any;

  constructor(
    private mediaSelectionService: WMediaSelectionService,
    private objectListService: WObjectListService,
    private uploader: WUploader
  ) {
    this.medias$ = this.mediaSelectionService.medias$;
    this.multipleSelection$ = this.mediaSelectionService.multipleSelection$;
    this.selectedMedias$ = this.objectListService.selectedObjects$;
    this.view$ = this.objectListService.view$;

    this.mediaSelectionService.mediaParent$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: Media) => this.mediaParent = res);


    this.objectListService.multipleSelection$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe(res => this.dropzoneConfig.maxFiles = (!res ? 1 : null));
  }

  ngOnInit(): void {
    this.mediaSelectionService.open$
      .pipe(takeUntil(componentDestroyed(this)))
      .subscribe((res: any) => {
        if (res) {
          // this.initialState(res);
          this.open(res);
          this.getObjects(true);
        }
      });
  }

  ngOnDestroy(): void {
  }

  open(options: any = { return: false }) {
    console.log('open media select modal:::', options);
    this.currentTab = options.selectedTab; // 'upload', 'photos';
    this.tabsFilter = this.tabs.filter((t: any) => {
      if (options.hiddenTabs.includes(t.link)) {
        return false;
      }
      return true;
    });
    this.allowCancelUpload = options.allowCancelUpload;
    this.uploadButtonText = options.uploadButtonText;
    this.dragdropText = options.dragdropText;

    // set content type depend on open options
    if (options.hiddenTabs.includes('photos')) {
      this.allowedFileTypes = ['video/mp4', 'video/x-m4v', 'video/*'];
    } else if (options.hiddenTabs.includes('videos')) {
      this.allowedFileTypes = ['image/*'];
    } else {
      this.allowedFileTypes = options.allowedFileTypes;
    }
    this.beforeCallBackUrl = options.beforeCallBackUrl;
    this.afterCallBackUrl = options.afterCallBackUrl;
    this.payload = options.payload;
    this.options = options;

    if (options.filter) {
      this.filter = options.filter;
    } else {
      this.filter = 'all';
    }

    this.nextLink = this.buildNextLink(); // 'media/photos'
    this.isLoading = false;
    this.initLoading = true;
    this.modal.open().then();
  }

  close(options: any = { return: false }) {
    this.mediaSelectionService.close();
    this.modal.close().then();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', event);
  }

  async onSubFilter(subFilter: 'photo' | 'album') {
    await this.tabAction({ link: this.currentTab }, subFilter);
  }

  async getObjects(override?: boolean) {
    try {
      if (this.nextLink && !this.isLoading) {
        this.isLoading = true;
        const res = await this.mediaSelectionService.getMedias(this.nextLink, override).toPromise();
        this.nextLink = res.meta.links.next;
        this.isLoading = false;
        this.initLoading = false;
        return res;
      } else {
        this.isLoading = false;
        this.initLoading = false;
        return Promise.resolve(null);
      }
    } catch (e) {
      console.warn('exception: ', e);
      this.isLoading = false;
      return Promise.reject(e);
    }
  }

  async tabAction(event: any = { link: this.currentTab }, subFilter: 'photo' | 'album' | undefined = 'photo') {
    this.mediaSelectionService.clear();
    this.currentTab = event.link;
    this.initLoading = true;
    this.subFilter = subFilter;

    if (this.currentTab !== 'upload') {
      this.nextLink = this.buildNextLink();
      const objects = await this.getObjects(true);
      console.log('objects: ', objects);

      if (this.currentTab === 'albums' || this.currentTab === 'favourites' || this.currentTab === 'search') {
        this.objectListService.setObjectsDisabled(['album', 'Common::Sharing']);
      } else {
        this.objectListService.setObjectsDisabled([]);
      }
    }
  }

  onTabBack() {
    const all = ['album', 'Common::Sharing'];
    if (this.currentTab === 'albums_detail') {
      this.currentTab = 'albums';
      this.objectListService.setObjectsDisabled(all);
    } else if (this.currentTab === 'favourites_detail') {
      this.currentTab = 'favourites';
      // this.subFilter = 'photo';
      this.objectListService.setObjectsDisabled(all);
    } else if (this.currentTab === 'search') {
      this.currentTab = 'photos';
    } else if (this.currentTab === 'search_detail') {
      this.currentTab = 'search';
      this.objectListService.setObjectsDisabled(all);
    }
    this.mediaSelectionService.clear();
    this.nextLink = this.buildNextLink();
    this.getObjects(true);
  }

  onCompleteLoadMore(event: boolean) {
    if (event) {
      this.getObjects();
    }
  }

  onInsert() {
    this.mediaSelectionService.setSelectedMedias(this.objectListService.getSelectedObjects());
    // this.onInsertEvent.emit(this.objectListService.getSelectedObjects());
    this.close();
    this.objectListService.clear();
  }

  onCompleteDoubleClick(item: Media) {
    if (item.object_type === 'Media::Album' || item.model === 'Common::Sharing') {
      if (this.currentTab === 'albums') {
        this.currentTab = 'albums_detail';
      } else if (this.currentTab === 'favourites') {
        this.currentTab = 'favourites_detail';
      } else if (this.currentTab === 'search') {
        this.currentTab = 'search_detail';
      }
      this.mediaSelectionService.clear();
      this.mediaSelectionService.setMediaParent(item);

      this.nextLink = this.buildNextLink();
      this.objectListService.setObjectsDisabled([]);

      this.initLoading = true;
      this.getObjects(true);
    } else {
      this.onInsert();
    }
  }

  async onCompleteSort(event: any) {
    if (event) {
      this.nextLink = this.buildNextLink() + `&sort=${event.sortOrder}&sort_name=${event.sortBy}`;
      this.sortName = event.sortBy;
      this.sortDirection = event.sortOrder;
      const mediaParent = this.mediaParent;
      this.mediaSelectionService.clear();
      this.mediaSelectionService.setMediaParent(mediaParent);
      this.initLoading = true;
      await this.getObjects();
    }
  }

  /**
   * Search
   * @param e
   */
  onSearchEnter(e: any) {
    this.searchText = e.search;
    this.tabAction({
      link: 'search'
    });
  }

  onSearchEscape(e?: any) {
    if (e) {
      this.searchShow = false;
      this.searchText = null;
      if (this.currentTab === 'search') {
        this.onTabBack();
      }
    }
  }

  /**
   * end Search
   */


  /**
   * Dropzone
   * @param args
   */
  onUploadError(args: any) {
    console.log('onUploadError:', args);
  }

  onUploadSuccess(args: any) {
    console.log('onUploadSuccess:', args);
  }

  onUploadThumbnail(args: any) {
    this.mediaSelectionService.upload(args);
    this.modal.close().then();
  }

  upload() {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      ...this.options,
      allowedFileTypes: this.allowedFileTypes,
      beforeCallBackUrl: this.beforeCallBackUrl,
      afterCallBackUrl: this.afterCallBackUrl,
      payload: this.payload,
    });

    this.sub = this.uploader.event$.subscribe(event => {
      if (event.action === 'start') {
        this.modal.close().then();
        this.sub.unsubscribe();
      }
    });
  }

  onToolbarEvent(event) {
    const { action, payload } = event;
    switch (action) {
      case 'sort': {
        const { sort_name, sort_direction } = payload;
        this.onCompleteSort({ sortOrder: sort_direction, sortBy: sort_name });
        break;
      }
    }
  }

  private buildNextLink() {
    let urlAPI = '';
    console.log(this.currentTab);

    switch (this.currentTab) {
      case 'photos':
        urlAPI = this.filter === 'all' ? 'media/media/index_combine?model=Media::Photo' : `media/photos?active=1`;
        break;
      case 'albums':
        urlAPI = `media/albums?active=1`;
        break;
      case 'albums_detail':
        urlAPI = this.filter === 'all' ? `media/albums/${this.mediaParent.uuid}/objects?model=Media::Album` :
          `media/photos?active=1&album=${this.mediaParent.id}`;
        break;
      case 'favourites':
        if (this.filter === 'all') {
          urlAPI = `media/favorites?active=1`;
          if (this.subFilter === 'photo') {
            // tslint:disable-next-line:max-line-length
            urlAPI = `media/favorites?filter[where][object_type]=Media::Photo&filter[or][object_type]=Media::Video&filter[or][object_type]=Media::Photo&filter[or][object_type]=Media::Video`;
          } else if (this.subFilter === 'album') {
            // urlAPI = `media/favorites?filter[where][object_type]=Media::Album&filter[or][object_type]=Media::Album`;
            urlAPI = `media/favorites?filter[where][object_type]=Media::Album&filter[or][object_type]=Common::Sharing`;
          }
        }
        if (this.filter === 'photo') {
          // tslint:disable-next-line:max-line-length
          urlAPI = `media/favorites?filter[where][object_type]=Media::Photo&filter[or][object_type]=Media::Album&filter[or][object_type]=Media::Album&filter[or][object_type]=Media::Photo`;
          if (this.subFilter === 'photo') {
            // tslint:disable-next-line:max-line-length
            urlAPI = `media/favorites?filter[where][object_type]=Media::Photo&filter[or][object_type]=Media::Photo`;
          } else if (this.subFilter === 'album') {
            // urlAPI = `media/favorites?filter[where][object_type]=Media::Album&filter[or][object_type]=Media::Album`;
            urlAPI = `media/favorites?filter[where][object_type]=Media::Album&filter[or][object_type]=Common::Sharing`;
          }
        }
        break;
      case 'favourites_detail':
        switch (this.mediaParent.model) {
          case 'Media::Album':
            urlAPI = `media/albums/${this.mediaParent.uuid}/objects?model=Media::Album`;
            break;
          case 'Common::Sharing':
            urlAPI = `media/sharings/${this.mediaParent.uuid}/objects`;
            break;
          default:
            urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
            break;
        }
        break;
      case 'search':
        urlAPI = `media/search?active=1&q=${this.searchText}&filter=${this.filter}`;
        break;
      case 'search_detail':
        switch (this.mediaParent.model) {
          case 'Media::Album':
            urlAPI = `media/media/${this.mediaParent.uuid}/objects?model=Media::Album`;
            break;
          case 'Common::Sharing':
            urlAPI = `media/sharings/${this.mediaParent.uuid}/objects`;
            break;
          default:
            urlAPI = `media/photos?active=1&album=${this.mediaParent.id}`;
            break;
        }
        break;
      default:
        urlAPI = null;
        break;
    }
    return urlAPI;
  }

}
