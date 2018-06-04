import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router, Resolve } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany,
  Download
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';
import { ApiBaseService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';
import { SharingModalV1Component } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-video-list',
  entryComponents: [
    SharingModalV1Component
  ],
  templateUrl: 'video-list.component.html'
})
export class ZMediaVideoListComponent implements OnInit {
  // display videos on screen
  videos: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;
  // modal component to load
  modalComponent: any;
  modal: any;
  // check has selected objects
  hasSelectedObjects: boolean = false;

  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;


  constructor(private apiBaseService: ApiBaseService, private router: Router, private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.load();
  }

  doEvent(e: any) {
    switch(e.action) {
      case 'uploaded':
        this.load();
      break;
      case 'viewDetails':
        this.router.navigate(['/videos', e.payload.selectedObject.id]);
      break;
    }
  }

  load() {
    this.apiBaseService.get(`media/videos`).subscribe(res => {
      this.videos = res.data;
    });
  }

  selectedObjectsChanged(e: any) {
    this.hasSelectedObjects = true;
    if(e && e.length == 0) this.hasSelectedObjects = false;

    this.videos = this.videos.map(v => {
      if(e.some(ob => ob.id == v.id)) {
        v.selected = true;
      } else {
        v.selected = false;
      }
      return v;
    })
  }

  doAction(e: any) {
    switch(e.action) {
      case 'openModal':
          this.loadModalComponent(SharingModalV1Component);
          // var objects = _.get(params, 'selectedObjects', []).concat(this.selectedObjects);
          // options = {selectedObjects: objects, updateListObjects: params.updateListObjects};
          break;
    }
  }

  openModal(e: any) {
    switch(e.action) {
      case 'share':
          this.loadModalComponent(SharingModalV1Component);
          this.modal.init({isNew: true});
          // var objects = _.get(params, 'selectedObjects', []).concat(this.selectedObjects);
          // options = {selectedObjects: objects, updateListObjects: params.updateListObjects};
          break;
    }
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);

    this.modal = this.modalComponent.instance;
  }
}
