import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import { ZNoteService } from './shared/services/note.service';
import { ZNoteAddFolderModalComponent } from './shared/modal/add-folder/add-folder-modal.component';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../core/shared/services/apibase.service';
import { WthConfirmService } from '../core/shared/components/confirmation/wth-confirm.service';
import { ZNoteSharedModalNoteEditComponent } from './shared/modal/note/edit.component';
import { ZNoteSharedModalNoteViewComponent } from './shared/modal/note/view.component';
import { ZNoteSharedModalFolderEditComponent } from './shared/modal/folder/edit.component';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  entryComponents: [
    ZNoteSharedModalNoteEditComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  @ViewChild('addFolder') addFolder: ZNoteAddFolderModalComponent;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private wthConfirmService: WthConfirmService,
              private noteService: ZNoteService) {
    console.log('Environment config', Config);
    this.commonEventService.filter((event: any) => event.channel == 'menuCommonEvent').subscribe((event: any) => {
      this.doEvent(event);

      /*if (event.action == "note:folder:create") {
        // reset folder data
        this.addFolder.folder = {};
        this.addFolder.open();
      }
      if (event.action == "note:folder:edit") {
        this.addFolder.folder = event.payload;
        this.addFolder.open();
      }

      if (event.action == "note:folder:delete") {
        this.wthConfirmService.confirm({
          message: 'Are you sure you want to delete this folder?',
          header: 'Delete Folder',
          accept: () => {
            this.apiBaseService.delete('note/folders/' + event.payload.id).subscribe((res: any) => {
              this.commonEventService.broadcast({
                channel: 'noteFolderEvent',
                action: 'updateFolders',
                payload: res.data
              })
            });
          }
        });
      }*/
    });
    this.noteService.modalEvent$.subscribe((event: any)=> this.doEvent(event));
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
    this.apiBaseService.get('note/folders').subscribe((res: any) => {
      this.commonEventService.broadcast({channel: 'noteFolderEvent', action: 'updateFolders', payload: res.data})
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  doEvent(event: any) {
    console.log(event);
    switch (event.action) {
      case 'note:folder:create':
        this.loadModalComponent(ZNoteSharedModalFolderEditComponent);
        this.modal.open();
        break;
      case 'note:open_modal_note_edit':
        this.loadModalComponent(ZNoteSharedModalNoteEditComponent);
        this.modal.open();
        break;
      case 'note:open_modal_note_view':
        this.loadModalComponent(ZNoteSharedModalNoteViewComponent);
        this.modal.data = event.payload;
        this.modal.open();
        break;
      default:
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
