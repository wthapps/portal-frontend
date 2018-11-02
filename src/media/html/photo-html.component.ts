import { Component, OnInit, OnDestroy } from '@angular/core';
import { Media } from '@shared/shared/models/media.model';
import { Observable } from 'rxjs/Observable';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

@Component({
  selector: 'app-photo-html',
  templateUrl: 'photo-html.component.html',
  styleUrls: ['photo-html.component.scss']
})
export class PhotoHtmlComponent implements OnInit, OnDestroy {
  medias$: Observable<Media[]>;
  mediaParent: Media;
  selectedMedias$: Observable<Media[]>;
  multipleSelection$: Observable<boolean>;
  view$: Observable<string>;
  nextLink: string;
  isLoading: boolean;

  dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: null, // 1
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };

  constructor(
    private mediaSelectionService: WMediaSelectionService,
    private objectListService: WObjectListService
  ) {
    this.medias$ = this.mediaSelectionService.medias$;
    this.multipleSelection$ = this.mediaSelectionService.multipleSelection$;
    this.selectedMedias$ = this.objectListService.selectedObjects$;
    this.view$ = this.objectListService.view$;

    this.mediaSelectionService.mediaParent$
      .takeUntil(componentDestroyed(this))
      .subscribe((res: Media) => (this.mediaParent = res));

    this.objectListService.multipleSelection$
      .takeUntil(componentDestroyed(this))
      .subscribe(res => (this.dropzoneConfig.maxFiles = !res ? 1 : null));
  }

  ngOnInit(): void {
    this.initialState();
    this.getObjects();
  }

  ngOnDestroy(): void {}

  testasasfd() {
    console.log('testasasfd');
  }

  initialState() {
    this.mediaSelectionService.clear();
    this.nextLink = this.buildNextLink(); // 'media/photos'
    this.isLoading = false;
  }

  getObjects() {
    if (this.nextLink && !this.isLoading) {
      this.isLoading = true;
      this.mediaSelectionService
        .getMedias(this.nextLink)
        .subscribe((res: ResponseMetaData) => {
          this.nextLink = res.meta.links.next;
          this.isLoading = false;
        });
    }
  }

  onCompleteLoadMore(event: boolean) {
    if (event) {
      this.getObjects();
    }
  }

  onCompleteDoubleClick(item: Media) {
    console.log(item);
  }

  onCompleteSort(event: any) {
    if (event) {
      this.nextLink =
        this.buildNextLink() +
        `&sort=${event.sortOrder}&sort_name=${event.sortBy}`;
      const mediaParent = this.mediaParent;
      this.mediaSelectionService.clear();
      this.mediaSelectionService.setMediaParent(mediaParent);
      this.getObjects();
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
    // console.log('onUploadThumbnail:', args);
    this.mediaSelectionService.upload(args);
  }

  private buildNextLink() {
    let urlAPI = 'media/photos?active=1';
    return urlAPI;
  }
}
