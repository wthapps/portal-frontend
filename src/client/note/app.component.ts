import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import { ZNoteService } from './shared/services/note.service';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../core/shared/services/apibase.service';
import { WthConfirmService } from '../core/shared/components/confirmation/wth-confirm.service';
import { NoteEditModalComponent } from './shared/modal/note/note-edit-modal.component';
import { ZNoteSharedModalNoteViewComponent } from './shared/modal/note/view.component';
import { ZNoteSharedModalFolderEditComponent } from './shared/modal/folder/edit.component';
import { ZNoteSharedModalSharingComponent } from './shared/modal/sharing/sharing.component';
import * as fromRoot from './shared/reducers/index';
import * as fromFolder from './shared/reducers/folder';
import { Folder } from './shared/reducers/folder';


/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  entryComponents: [
    NoteEditModalComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalSharingComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  folders$: Observable<Folder[]>;

  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private wthConfirmService: WthConfirmService,
              private store: Store<fromRoot.State>,
              private noteService: ZNoteService) {
    console.log('Environment config', Config);
    this.commonEventService.filter((event: any) => event.channel == 'menuCommonEvent' || event.channel == 'noteActionsBar').subscribe((event: any) => {
      this.doEvent(event);
    });
    this.noteService.modalEvent$.subscribe((event: any)=> this.doEvent(event));

    this.folders$ = this.store.select(fromRoot.getFoldersTree)
      .map((folders: any[]) => { return folders.map((f: any) => fromFolder.mapFolderToItem(f));})
      .do((folders: any[]) => console.debug('app folders: ', folders));
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
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
      case 'note:open_note_edit_modal':
        this.loadModalComponent(NoteEditModalComponent);
        this.modal.note = event.payload;
        this.modal.open({mode: 'edit'});
        break;
      case 'note:folder:edit':
        this.loadModalComponent(ZNoteSharedModalFolderEditComponent);
        this.modal.folder = event.payload;
        this.modal.open();
        break;
      case 'note:folder:sharing':
        this.loadModalComponent(ZNoteSharedModalSharingComponent);
        this.modal.folder = event.payload;
        this.modal.open();
        break;
      case 'note:folder:delete':
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
