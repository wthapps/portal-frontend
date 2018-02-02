import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MediaObjectService } from '../shared/container/media-object.service';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AlbumCreateModalComponent } from '@wth/shared/shared/components/photo/modal/album-create-modal.component';
import { FileSelectComponent } from "@shared/shared/components/file/file-select/file-select.component";
import { AddToAlbumModalComponent } from "@shared/shared/components/photo/modal/add-to-album-modal.component";
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Store } from '@ngrx/store';
import * as appStore from '../shared/store';
import * as fromObject from '../shared/store/object';
import { Observable } from 'rxjs/Observable';
import { EditNameModalComponent } from '@wth/shared/components/modal';

@Component({
  selector: 'shared-by-me',
  templateUrl: 'shared-by-me.page.html',
  entryComponents:[
    EditNameModalComponent,
    AlbumCreateModalComponent,
    FileSelectComponent
  ]
})
export class SharedByMePage implements OnInit {

  objects: Observable<Array<any>>;
  selectedObjects: Observable<Array<any>>;

  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private confirmService: WthConfirmService,
    private store: Store<appStore.State>
  ) {
    this.objects = this.store.select(appStore.getObjects);
    this.selectedObjects = this.store.select(appStore.getSelectedObjects);
  }

  ngOnInit() {
    this.store.dispatch({type: fromObject.GET_ALL, payload: {url: '/sharings'}});
  }

  doEvents(event: any) {
    switch (event.action) {
      case 'select':
      case 'deselect':
        this.store.dispatch({type: fromObject.SELECT, payload: {selectedObjects: event.payload.selectedObjects}});
        break;
      case 'deselectAll':
        this.store.dispatch({type: fromObject.DESELECT_ALL, payload: {}});
        break;
      case 'viewDetails':
        this.viewDetails(event);
        break;
      case 'openUpdate':
        this.openModal(event.payload);
        break;
      case 'update':
        this.store.dispatch({type: fromObject.UPDATE, payload: {selectedObject: event.payload.selectedObject}});
        break;
      case 'delete':
        this.delete(event.payload.selectedObjects);
        break;
    }
  }

  viewDetails(option: any) {
    this.router.navigate(['shared-by-me-new', option.payload.selectedObject.id]);
  }

  delete(objects: any) {
    this.confirmService.confirm({
      header: 'Delete sharing',
      acceptLabel: 'Delete',
      message: `Deleting selected sharing(s) will stop other users from accessing your photos
      <br/>Your photos will be in your library`,
      accept: () => {
        this.store.dispatch({type: fromObject.DELETE, payload: {selectedObjects: objects}});
      }
    });
  }

  openModal(params: any) {
    let options: any;
    switch (params.modalName) {
      case 'editNameModal':
        this.loadModalComponent(EditNameModalComponent);
        options = {selectedObject: params.selectedObject};
        break;
    }
    if (this.modal) {
      this.modal.open(options);
    }
  }

  closeModal() {
    this.modal.close();
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    this.modal.event.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doEvents(event);
    });
  }

}
