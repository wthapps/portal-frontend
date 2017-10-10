import { Component, OnInit, Input } from '@angular/core';
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
  templateUrl: 'folder-item.component.html'
})
export class FolderItemComponent implements OnInit {
  @Input() data: any;
  tooltip: any = Constants.tooltip;

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

  onSelected() {
    // this.selected = !this.selected;
    // if (this.selected) {
    //   this.noteService.addItemSelectedObjects(this.data);
    // } else {
    //   this.noteService.removeItemSelectedObjects(this.data);
    // }

    this.store.dispatch(new note.Select({id: this.data.id, object_type: this.data.object_type}));
  }

  onClick() {
    this.onSelected();
    console.log('click');
  }

  onView() {
    this.router.navigate([`/folders`, this.data.id]);
  }
}
