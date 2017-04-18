import {
  Component, Input, Output, EventEmitter, AfterViewInit, OnInit, ElementRef,
  ComponentFactoryResolver
} from '@angular/core';
import { MediaObjectService } from '../../container/media-object.service';
import { Constants } from '../../../../core/shared/config/constants';
import { LoadingService } from '../../../../core/partials/loading/loading.service';
import { MediaListComponent } from '../../media/media-list.component';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { ActivatedRoute } from '@angular/router';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'me-list',
  templateUrl: 'photo-view-list.component.html',
  styleUrls: ['photo-view-list.component.css'],
  providers: [
    MediaObjectService
  ]
})

export class PhotoViewListComponent {

  constructor(
    protected resolver: ComponentFactoryResolver,
    protected mediaObjectService: MediaObjectService,
    protected elementRef: ElementRef,
    protected loadingService: LoadingService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected confirmationService: ConfirmationService
  ) {
    // super(resolver, mediaObjectService, elementRef, router, route, confirmationService, loadingService);
  }

}
