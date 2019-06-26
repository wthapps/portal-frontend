import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Store } from '@ngrx/store';
import * as note from '../../actions/note';
import * as folder from '../../actions/folder';
import * as context from '../../reducers/context';
import { withLatestFrom, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare var $: any;
declare var _: any;

@Component({
  selector: 'z-note-shared-modal-folder-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.scss']
})

export class ZNoteSharedModalFolderEditComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  titleModal = 'New Folder';

  form: FormGroup;
  name: AbstractControl;
  folder: any = {};
  currentFolder: any = {};
  breadcrumb = false;
  mode = 'add';
  context;

  private destroySubject: Subject<any> = new Subject();

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService,
    private apiBaseService: ApiBaseService, private store: Store<any>) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
    this.store.select(context.getContext).pipe(takeUntil(this.destroySubject)).subscribe(ctx => this.context = ctx);
  }

  ngOnInit(): void {
    this.name.setValue(this.folder.name);
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }


  open(options?: any) {
    this.mode = options.mode;
    if (this.mode === 'add') {
      this.titleModal = 'Add Folder';
    } else if (this.mode === 'edit') {
      this.titleModal = 'Edit Folder';
      this.folder = options.folder;
      this.breadcrumb = options.breadcrumb;
    }
    this.modal.open();
  }

  onSubmit(value: any) {
    this.folder.name = value.name;
    if (this.folder.id) {
      this.apiBaseService.put('note/folders/' + this.folder.id, this.folder).subscribe((res: any) => {
        [new note.NoteUpdated(res.data), new folder.UpdateFolderPath(res.data)].forEach((a: any) => this.store.dispatch(a));
        this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: [res.data]});
        this.modal.close();
      });
    } else {
      if (this.currentFolder && this.context.permissions.edit === true) {
        this.folder.parent_id = this.currentFolder.id;
      } else {
        this.folder.parent_id = undefined;
      }
      this.apiBaseService.post('note/folders', this.folder)
        .pipe(
          withLatestFrom(this.store, (res: any, state: any) => {
            return {res: res, state: state.context};
          }))
        .subscribe((combine: any) => {
          if (combine.state.permissions.edit) {
            this.store.dispatch(new note.MultiNotesAdded([combine.res.data]));
          }
          this.commonEventService.broadcast({action: 'update', channel: 'noteLeftMenu', payload: [combine.res.data]});
          this.modal.close();
        });
    }
  }
}
