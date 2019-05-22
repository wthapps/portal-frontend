import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { ZNoteService } from './shared/services/note.service';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
// import { ZNoteSharedModalNoteViewComponent } from './shared/modal/note/view.component';
import { ZNoteSharedModalFolderEditComponent } from './shared/modal/folder/edit.component';
import { ZNoteSharedModalFolderMoveComponent } from './shared/modal/folder/move.component';
import { ZNoteSharedModalSharingComponent } from './shared/modal/sharing/sharing.component';
import * as fromRoot from './shared/reducers/index';
import { Folder } from './shared/reducers/folder';
import * as note from './shared/actions/note';
import * as context from './shared/reducers/context';
import * as progressContext from './shared/reducers/progress-context';
import { MixedEntityService } from './shared/mixed-enity/mixed-entity.service';
import { noteConstants } from '@notes/shared/config/constants';
import { AuthService, UrlService } from '@wth/shared/services';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { withLatestFrom, filter, takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '@shared/partials/header';
import { PromptUpdateService } from '@shared/services/service-worker/prompt-update.service';
import { LogUpdateService } from '@shared/services/service-worker/log-update.service';
import { CheckForUpdateService } from './../shared/services/service-worker/check-for-update.service';
import { SwPushService } from '@shared/services/service-worker/sw-push.service';
import { PageVisibilityService } from '@shared/services/page-visibility.service';
import { SwUpdate } from '@angular/service-worker';

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
    // NoteEditModalComponent,
    // ZNoteSharedModalNoteViewComponent,
    ZNoteSharedModalFolderEditComponent,
    ZNoteSharedModalSharingComponent,
    ZNoteSharedModalFolderMoveComponent
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalContainer', { read: ViewContainerRef })
  modalContainer: ViewContainerRef;
  @ViewChild('introduction') introduction: IntroductionModalComponent;
  @ViewChild('header') header: HeaderComponent;

  modalComponent: any;
  modal: any;
  folders$: Observable<Folder[]>;
  folder$: any;
  currentFolder: any;
  destroySubject: Subject<any> = new Subject();

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private resolver: ComponentFactoryResolver,
    private commonEventService: CommonEventService,
    private apiBaseService: ApiBaseService,
    private wthConfirmService: WthConfirmService,
    private store: Store<fromRoot.State>,
    private noteService: ZNoteService,
    private mixedEntityService: MixedEntityService,
    private visibilityService: PageVisibilityService,
    private swPush: SwPushService,
    private checUpdate: CheckForUpdateService,
    private urlSerive: UrlService,
    private promptUpdate: PromptUpdateService
  ) {

    this.commonEventService
      .filter(
        (event: any) =>
          event.channel === 'menuCommonEvent' ||
          event.channel === 'noteActionsBar'
      )
      .subscribe((event: any) => {
        this.doEvent(event);
      });
    this.noteService.modalEvent$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((event: any) => this.doEvent(event));
    this.store
      .select(fromRoot.getCurrentFolder)
      .pipe(takeUntil(this.destroySubject))
      .subscribe((folder: any) => {
        this.currentFolder = folder;
      });

    this.visibilityService.reloadIfProfileInvalid();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroySubject)
      )
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngAfterViewInit() {
    if (
      !this.authService.user.introduction ||
      !this.authService.user.introduction.note
    ) {
      this.introduction.open();
    }
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
        this.modal.open({ mode: 'add' });
        break;
      case 'note:open_note_edit_modal':
        this.store.dispatch(new note.Edit(event.payload));
        this.router.navigate(
          [{ outlets: { detail: ['notes', event.payload.id] } }],
          { queryParamsHandling: 'preserve', preserveFragment: true }
        );
        break;
      case 'note:open_note_view_modal':
        this.router.navigate(
          [{ outlets: { detail: ['notes', event.payload.id] } }],
          { queryParamsHandling: 'preserve', preserveFragment: true }
        );
        break;
      case 'note:open_note_add_modal':
        // TODO:
        this.store.dispatch(new note.ResetCurrentNote());
        this.router.navigate([{ outlets: { detail: ['new_note'] } }], {
          queryParamsHandling: 'preserve',
          skipLocationChange: true,
          preserveFragment: true
        });
        break;
      case 'note:folder:edit':
        this.loadModalComponent(ZNoteSharedModalFolderEditComponent);
        this.modal.open({
          mode: 'edit',
          folder: event.payload,
          breadcrumb: event.breadcrumb
        });
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
      case 'note:mixed_entity:move_to_folder': {
        let number = event.payload.length;
        if (number === 1) {
          this.store.dispatch({
            type: progressContext.SET_PROGRESS_CONTEXT,
            payload: {
              open: true,
              textMessage: `Moving "${event.payload[0].name}"`
            }
          });
        }
        if (number > 1) {
          this.store.dispatch({
            type: progressContext.SET_PROGRESS_CONTEXT,
            payload: { open: true, textMessage: `Moving ${number} files` }
          });
        }

        this.mixedEntityService
          .update({ payload: event.payload }, true)
          .pipe(
            withLatestFrom(
              this.store.select(context.getContext),
              (res: any, state: any) => {
                return { res: res, state: state };
              }
            )
          )
          .subscribe((combine: any) => {
            if (
              combine.state.page === noteConstants.PAGE_MY_NOTE ||
              combine.state.page === noteConstants.PAGE_INSIDE_FOLDER
            ) {
              let callback = () => {
                this.router.navigate(['my-note']);
              };
              if (combine.res.data && combine.res.data[0].parent_id) {
                callback = () => {
                  this.router.navigate([
                    'folders',
                    combine.res.data[0].parent_id
                  ]);
                };
              }
              number = combine.res.data.length;
              if (number === 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    enableAction: true,
                    actionText: 'Find',
                    callback: callback,
                    textMessage: `Moved "${event.payload[0].name}"`
                  }
                });
              }
              if (number > 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    enableAction: true,
                    actionText: 'Find',
                    callback: callback,
                    textMessage: `Moved ${number} files`
                  }
                });
              }
              this.store.dispatch(new note.NotesDeleted(event.payload));
              this.commonEventService.broadcast({
                action: 'update',
                channel: 'noteLeftMenu',
                payload: event.payload
              });
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
            } else {
              let callback = () => {
                this.router.navigate(['my-note']);
              };
              if (combine.res.data && combine.res.data[0].parent_id) {
                callback = () => {
                  this.router.navigate([
                    'folders',
                    combine.res.data[0].parent_id
                  ]);
                };
              }
              number = combine.res.data.length;
              if (number === 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    enableAction: true,
                    actionText: 'Find',
                    callback: callback,
                    textMessage: `Moved "${event.payload[0].name}"`
                  }
                });
              }
              if (number > 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    enableAction: true,
                    actionText: 'Find',
                    callback: callback,
                    textMessage: `Moved ${number} files`
                  }
                });
              }
            }
          });
        break;
      }
      case 'note:mixed_entity:make_a_copy': {
        const number = event.payload.length;
        if (number === 1) {
          this.store.dispatch({
            type: progressContext.SET_PROGRESS_CONTEXT,
            payload: {
              open: true,
              textMessage: `Copying "${event.payload[0].name}"`
            }
          });
        }
        if (number > 1) {
          this.store.dispatch({
            type: progressContext.SET_PROGRESS_CONTEXT,
            payload: { open: true, textMessage: `Copying ${number} files` }
          });
        }
        this.mixedEntityService
          .create(event.payload, true)
          .pipe(
            withLatestFrom(
              this.store.select(context.getContext),
              (res: any, state: any) => {
                return { res: res, state: state };
              }
            )
          )
          .subscribe((combine: any) => {
            if (
              combine.state.page === noteConstants.PAGE_MY_NOTE ||
              combine.state.page === noteConstants.PAGE_INSIDE_FOLDER
            ) {
              if (number === 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    textMessage: `Copied "${event.payload[0].name}"`
                  }
                });
              }
              if (number > 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: { open: true, textMessage: `Copied ${number} files` }
                });
              }
              this.store.dispatch(new note.MultiNotesAdded(combine.res.data));
            } else {
              const callback = () => {
                this.router.navigate(['my-note']);
              };
              if (number === 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    enableAction: true,
                    actionText: 'Find',
                    callback: callback,
                    textMessage: `Copied "${event.payload[0].name}"`
                  }
                });
              }
              if (number > 1) {
                this.store.dispatch({
                  type: progressContext.SET_PROGRESS_CONTEXT,
                  payload: {
                    open: true,
                    enableAction: true,
                    actionText: 'Find',
                    callback: callback,
                    textMessage: `Copied ${number} files`
                  }
                });
              }
            }
          });
        break;
      }
      case 'note:mixed_entity:delete':

        // this.router.navigate(['trash']);
        this.mixedEntityService
          .delete(0, event.payload)
          .subscribe((res: any) => {
            const number = event.payload.length;
            if (number === 1) {
              this.store.dispatch({
                type: progressContext.SET_PROGRESS_CONTEXT,
                payload: {
                  open: true,
                  textMessage: `Removed "${event.payload[0].name}"`
                }
              });
            }
            if (number > 1) {
              this.store.dispatch({
                type: progressContext.SET_PROGRESS_CONTEXT,
                payload: { open: true, textMessage: `Removed ${number} files` }
              });
            }
            this.store.dispatch(new note.NotesDeleted(event.payload));
            this.commonEventService.broadcast({
              action: 'destroy',
              channel: 'noteLeftMenu',
              payload: event.payload
            });
            if (event.payload && event.payload.length === 1
              && parseInt(this.urlSerive.getId()) === event.payload[0].id && event.payload[0].object_type === 'Note::Folder') {
              this.router.navigate(['trash']);
            }
          });
        break;
      case 'note:folder:delete':
        this.wthConfirmService.confirm({
          message: 'Are you sure you want to delete this folder?',
          header: 'Delete Folder',
          accept: () => {
            this.apiBaseService
              .delete('note/folders/' + event.payload.id)
              .subscribe((res: any) => {
                this.commonEventService.broadcast({
                  channel: 'noteFolderEvent',
                  action: 'updateFolders',
                  payload: res.data
                });
              });
          }
        });
        break;
      case 'note:note_edit:export_pdf': {
        const number = event.payload.length;
        if (number === 1) {
          this.store.dispatch({
            type: progressContext.SET_PROGRESS_CONTEXT,
            payload: {
              open: true,
              textMessage: `Exporting ${event.payload[0].name}`
            }
          });
        }
        if (number > 1) {
          this.store.dispatch({
            type: progressContext.SET_PROGRESS_CONTEXT,
            payload: { open: true, textMessage: `Exporting ${number} files` }
          });
        }
        let n = number;
        for (const object of event.payload) {
          this.apiBaseService
            .download('note/notes/pdf_download/' + object.id)
            .subscribe((res: any) => {
              const blob = new Blob([res], { type: 'application/pdf' });
              saveAs(blob, object.name + '.pdf');
              n = n - 1;
              if (n === 0) {
                if (number === 1) {
                  this.store.dispatch({
                    type: progressContext.SET_PROGRESS_CONTEXT,
                    payload: {
                      open: true,
                      textMessage: `Exported "${event.payload[0].name}"`
                    }
                  });
                }
                if (number > 1) {
                  this.store.dispatch({
                    type: progressContext.SET_PROGRESS_CONTEXT,
                    payload: {
                      open: true,
                      textMessage: `Exported ${number} files`
                    }
                  });
                }
              }
            });
        }
        break;
      }
      default:
        break;
    }
  }

  private loadModalComponent(component: any) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(
      component
    );
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(
      modalComponentFactory
    );
    this.modal = this.modalComponent.instance;
  }
}
