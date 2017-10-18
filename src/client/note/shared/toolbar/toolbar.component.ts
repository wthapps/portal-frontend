import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';
import * as fromRoot from '../reducers/index';
import { Store } from '@ngrx/store';

import * as note from '../actions/note';


@Component({
  moduleId: module.id,
  selector: 'z-note-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ZNoteSharedToolBarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';
  @Input() selectedObjects: any[]=[];
  @Input() page: string = 'MY_NOTE';

  tooltip: any = Constants.tooltip;

  viewOption: string = 'list';
  readonly PAGE_TYPE: any = Constants.notePageType;

  constructor(private noteService: ZNoteService, private store: Store<fromRoot.State>) {
    // if(this.page === '')
    //   this.page = this.PAGE_TYPE.MY_NOTE;
    this.noteService.viewOption$.subscribe((viewOption: any)=> {
      this.viewOption = viewOption;
    });
  }

  ngOnInit() {

  }

  onChangeView(view: string) {
    // this.noteService.changeModeView(view);
    this.store.dispatch(new note.ChangeViewMode(view));
  }
}
