import { Component, HostBinding, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ZNoteService } from '../services/note.service';
import { Store } from '@ngrx/store';
import * as listReducer from '../reducers/features/list-mixed-entities';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { WDataViewComponent } from "../../../sample/shared/components/w-dataView/w-dataView.component";
import { Constants } from "@shared/constant";

declare var _: any;

@Component({
  selector: 'z-note-container',
  templateUrl: 'note-container.component.html',
  styleUrls: ['note-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZNoteContainerComponent implements OnInit {
  @Input() breadcrumbs: any;
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  tooltip: any = Constants.tooltip;
  data$: Observable<any[]>;
  next: string;
  menuActions = [
    {
      active: true,
      icon: 'fa fa-share-alt',
      text: this.tooltip.share,
      action: 'share'
    },
    {
      active: true,
      icon: 'fa fa-star-o',
      text: this.tooltip.favourite,
      action: 'favorite'
    },
    {
      active: true,
      icon: 'fa fa-trash-o',
      text: this.tooltip.delete,
      action: 'delete'
    }
  ];

  otherActions = [
    {
      active: true,
      icon: 'fa fa-pencil',
      text: 'Edit',
      action: 'edit'
    },
    {
      active: true,
      icon: 'fa fa-download',
      text: 'Move to folder',
      action: 'move_to_folder'
    }
  ];

  constructor(
    private noteService: ZNoteService,
    private route: ActivatedRoute,
    private router: Router,
    private wthConfirmService: WthConfirmService,
    private store: Store<any>
  ) {
    this.data$ = this.store.select(listReducer.getAllItems);
  }

  ngOnInit() {
    // File does not exist
    this.route.queryParams.subscribe((params: any) => {
      if (params.error === 'file_does_not_exist') {
        this.wthConfirmService.confirm({
          message:
            'You are in deleted note or invalid permission',
          header: 'Note not found',
          rejectLabel: null,
          accept: () => {
            this.router.navigate(['my-note']);
          },
          reject: () => {
            this.router.navigate(['my-note']);
          }
        });
      }
    });
  }

  onNewNote() {
    this.noteService.modalEvent({action: 'note:open_note_add_modal'});
  }

  onFolder() {
    this.noteService.modalEvent({
      action: 'note:folder:create'
    });
  }

  onBreadcrumbAction(event: any) {
    this.noteService.modalEvent({
      action: event.action,
      payload: event.payload,
      breadcrumb: true
    });
  }

  // constructor(private dataService: NoteService) {
  //   this.data$ = this.dataService.data$;
  // }

  // ngOnInit(): void {
  //   this.getDataAsync().then();
  // }

  async getDataAsync() {
    // const data = await this.dataService.getData(this.next).toPromise();
    // this.next = data.meta.links.next;
  }

  onLoadMoreCompleted(event: any) {
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }

  async onSortComplete(event: any) {
    // console.log(event);
    // const data = await this.dataService.sort(event).toPromise();
    // this.next = data.meta.links.next;
  }

  onViewComplete(event: any) {
    this.dataView.viewMode = event;
    this.dataView.container.update();
    this.dataView.updateView();
  }

  onSelectCompleted() {

    // update icon favorite
    this.updateMenuFavorite(_.every(this.dataView.selectedDocuments, 'favorite'));

    // check menu view
    const otherActionsEdit = _.find(this.otherActions, ['action', 'edit']);
    otherActionsEdit.active = !(this.dataView.selectedDocuments.length > 1);
  }

  private updateMenuFavorite(isFavorite: boolean) {
    const menuActionsIndex = this.menuActions.findIndex(x => x.action === 'favorite');
    this.menuActions[menuActionsIndex].icon = isFavorite ? 'fa fa-star' : 'fa fa-star-o';
  }
}
