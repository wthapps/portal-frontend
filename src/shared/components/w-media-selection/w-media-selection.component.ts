import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { PhotoModalDataService } from '@shared/services/photo-modal-data.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { Subscription } from 'rxjs/Subscription';
import { BsModalComponent } from 'ng2-bs3-modal';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { Observable } from 'rxjs/Observable';
import { Photo } from '@shared/shared/models';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WMediaListService } from '@shared/components/w-media-list/w-media-list.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'w-media-selection',
  templateUrl: 'w-media-selection.component.html',
  styleUrls: ['w-media-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WMediaSelectionComponent implements OnInit, OnDestroy {

  @ViewChild('modal') modal: BsModalComponent;

  openSubscription: Subscription;

  medias$: Observable<Media[]>;
  mediaParent$: Observable<Media>;
  selectedMedias$: Observable<Media[]>;

  currentTab: String = 'photos'; // photos, albums, albums_detail, favourites, shared_with_me

  nextLink: String = 'media/photos';
  isLoading: boolean;

  constructor(private mediaSelectionService: WMediaSelectionService,
              private photoDataService: PhotoModalDataService,
              private objectListService: WObjectListService,
              private commonEventService: CommonEventService) {
    this.medias$ = this.mediaSelectionService.medias$;
    this.mediaParent$ = this.mediaSelectionService.mediaParent$;
    this.selectedMedias$ = this.objectListService.selectedObjects$;
  }

  ngOnInit(): void {
    this.openSubscription = this.photoDataService.openObs$.subscribe(
      (options: any) => {
        console.log('open: options: ', options);
        this.open(options);

        this.getObjects();
      }
    );
  }

  ngOnDestroy(): void {
  }

  open(options: any = {return: false}) {
    this.modal.open().then();
  }

  dismiss(event: any): void {
    console.log('Post Photo Select Component DISMISSED', event);
  }

  tabAction(action: string) {
    this.currentTab = action;
    this.nextLink = `media/${this.currentTab}`;
    this.mediaSelectionService.clearMediaParent();
    this.mediaSelectionService.clear();
    this.objectListService.clear();
    this.getObjects();

    if (this.currentTab === 'albums') {
      this.objectListService.setMultipleSelection(false);
    } else {
      this.objectListService.setMultipleSelection(true);
    }
  }

  getObjects() {
    if (this.nextLink && !this.isLoading) {
      this.isLoading = true;
      this.mediaSelectionService.getMedias(this.nextLink).subscribe(
        (res: ResponseMetaData) => {
          this.nextLink = res.page_metadata.links.next;
          this.isLoading = false;
        }
      );
    }
  }

  onCompleteLoadMore(event: boolean) {
    if (event) {
      this.getObjects();
    }
  }

  onCompleteSort(event: any) {
    if (event) {
      console.log(event);
      this.nextLink = `media/${this.currentTab}?sort=${event.sortOrder}&sort_name=${event.sortBy}`;
      this.mediaSelectionService.clear();
      this.getObjects();
    }
  }

  onInsert() {
    console.log(this.objectListService.getSelectedObjects());
    this.modal.close().then();
  }

  onTabBack() {
    if (this.currentTab === 'albums_detail') {
      this.currentTab = 'albums';
    } else if (this.currentTab === 'favourites_detail') {
      this.currentTab = 'favourites';
    }
    this.nextLink = `media/${this.currentTab}`;

    this.objectListService.setMultipleSelection(false);

    this.mediaSelectionService.clearMediaParent();
    this.mediaSelectionService.clear();
    this.objectListService.clear();
    this.getObjects();
  }

  onCompleteDoubleClick(item: Media) {
    console.log('onCompleteDoubleClick:', item);
    if (item.object_type === 'album') {
      if (this.currentTab === 'albums') {
        this.currentTab = 'albums_detail';
        this.nextLink = `media/photos?album=${item.id}`;

      } else if (this.currentTab === 'favourites') {
        this.currentTab = 'favourites_detail';
        this.nextLink = `media/photos?album=${item.id}`;
      }
      this.objectListService.setMultipleSelection(true);

      this.mediaSelectionService.setMediaParent(item);
      this.mediaSelectionService.clear();
      this.objectListService.clear();
      this.getObjects();
    }
  }
}
