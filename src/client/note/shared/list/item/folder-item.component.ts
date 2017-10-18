import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Note } from '../../../../core/shared/models/note.model';
import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';

import * as fromRoot from '../../reducers/index';
import * as note from '../../actions/note';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'folder-item',
  templateUrl: 'folder-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderItemComponent implements OnInit {
  @Input() data: any;
  tooltip: any = Constants.tooltip;
  @Input() readonly: boolean = false;

  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  // selected: boolean = false;
  isSelectAll$: Observable<boolean>;

  constructor(private noteService: ZNoteService,
              private store: Store<fromRoot.State>,
              private router: Router) {
    // this.noteService.isSelectAll$.subscribe((isSelectAll: boolean)=> {
    //   this.selected = isSelectAll;
    // });
  }

  ngOnInit() {
    this.isSelectAll$ = this.store.select(fromRoot.getSelectAll);
  }

  onClick() {
    this.onAction.emit({
      action: 'click',
      data: this.data,
    });
  }

  onView() {
    this.onAction.emit({
      action: 'dblclick',
      data: this.data,
    });
  }
}
