import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import './operators';
import 'rxjs/add/operator/filter';
import { Subject } from 'rxjs/Subject';

import { ZNoteService } from './shared/services/note.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { NoteEditModalComponent } from './shared/modal/note/note-edit-modal.component';
import { ZNoteSharedModalNoteViewComponent } from './shared/modal/note/view.component';
import { ZNoteSharedModalFolderEditComponent } from './shared/modal/folder/edit.component';
import { ZNoteSharedModalFolderMoveComponent } from './shared/modal/folder/move.component';
import { ZNoteSharedModalSharingComponent } from './shared/modal/sharing/sharing.component';
import * as fromRoot from './shared/reducers/index';
import { Folder } from './shared/reducers/folder';
import * as note from './shared/actions/note';
import * as context from './shared/reducers/context';
import { MixedEntityService } from './shared/mixed-enity/mixed-entity.service';


declare var _: any;

/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    NoteEditModalComponent,
    ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalSharingComponent,
    ZNoteSharedModalFolderMoveComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  folders$: Observable<Folder[]>;
  folder$: any;
  currentFolder: any;
  destroySubject: Subject<any> = new Subject();

  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private wthConfirmService: WthConfirmService,
              private store: Store<fromRoot.State>,
              private noteService: ZNoteService,
              private mixedEntityService: MixedEntityService) {
    this.commonEventService.filter((event: any) => event.channel == 'menuCommonEvent' || event.channel == 'noteActionsBar').subscribe((event: any) => {
      this.doEvent(event);
    });
    this.noteService.modalEvent$.takeUntil(this.destroySubject).subscribe((event: any) => this.doEvent(event));
    this.store.select(fromRoot.getCurrentFolder).takeUntil(this.destroySubject).subscribe((folder: any) => {
      this.currentFolder = folder;
    });
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  doEvent(event: any) {
    // console.log(event);
    switch (event.action) {
      case 'note:folder:create':
        this.loadModalComponent(ZNoteSharedModalFolderEditComponent);
        if (this.currentFolder) {
          this.modal.currentFolder = this.currentFolder;
        }
        this.modal.open({mode: 'add'});
        break;
      case 'note:open_note_edit_modal':
        this.loadModalComponent(NoteEditModalComponent);
        this.store.dispatch(new note.Edit(event.payload));
        this.modal.note = event.payload;
        this.modal.open({mode: 'edit', parent_id: _.get(event, 'payload.parent_id')});
        break;
      case 'note:open_note_view_modal':
        this.loadModalComponent(ZNoteSharedModalNoteViewComponent);
        this.modal.note = event.payload;
        this.modal.open();
        break;
      case 'note:open_note_add_modal':
        this.loadModalComponent(NoteEditModalComponent);
        this.store.dispatch(new note.ResetCurrentNote());
        this.modal.open({mode: 'add', parent_id: _.get(event, 'payload.parent_id')});
        break;
      case 'note:folder:edit':
        this.loadModalComponent(ZNoteSharedModalFolderEditComponent);
        this.modal.open({mode: 'edit', folder: event.payload, breadcrumb: event.breadcrumb});
        break;
      case 'note:mixed_entity:open_sharing_modal':
        this.loadModalComponent(ZNoteSharedModalSharingComponent);
        this.modal.sharedObjects = event.payload;
        this.modal.open();
        break;
      case 'note:mixed_entity:open_move_to_folder_modal':
        this.loadModalComponent(ZNoteSharedModalFolderMoveComponent);
        this.modal.selectedObjects = event.payload;
        this.modal.open();
        break;

      // TODO move all of below services to store effect
      case 'note:mixed_entity:move_to_folder':
        this.mixedEntityService.update({payload: event.payload}, true)
          .subscribe((res: any) => {
            this.store.dispatch(new note.NotesDeleted(event.payload));
            this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: event.payload});
            // Delete old folders
            _.forEach(event.payload, (item: any) => {
              item.parent_id = item.parent_old_id;
            });
            this.commonEventService.broadcast({
              action: 'destroy',
              channel: 'noteLeftMenu',
              payload: event.payload
            });
            this.commonEventService.broadcast({
              action: 'note:mixed_entity:move_to_folder_done',
              channel: 'noteActionsBar',
              payload: event.payload
            });
          });
        break;
      case 'note:mixed_entity:make_a_copy':
        this.mixedEntityService.create(event.payload, true)
          .subscribe((res: any) => {
            this.store.dispatch(new note.MultiNotesAdded(res.data));
          });
        break;
      case 'note:mixed_entity:delete':
        this.mixedEntityService.delete(0, event.payload)
          .subscribe((res: any) => {
            this.store.dispatch(new note.NotesDeleted(event.payload));
            this.commonEventService.broadcast({action: 'destroy', channel: 'noteLeftMenu', payload: event.payload});
        });
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
              });
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
