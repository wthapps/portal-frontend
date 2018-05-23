import { Component, OnInit, HostBinding, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
;
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';
import * as context from '../reducers/context';
import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../services/note.service';
import { CommonEventService } from "@shared/services";

@Component({
  selector: 'z-note-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZNoteSharedToolBarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';
  @Input() selectedObjects: any[]=[];
  @Input() page: string = 'MY_NOTE';

  tooltip: any = Constants.tooltip;

  // viewOption: string = 'list';
  viewMode$: Observable<string>;
  readonly PAGE_TYPE: any = Constants.notePageType;

  constructor(private noteService: ZNoteService,
    private commonEventService: CommonEventService,
    private store: Store<fromRoot.State>) {
    this.viewMode$ = this.store.select(fromRoot.getViewMode);
  }

  ngOnInit() {
    //
  }

  onChangeView(view: string) {

    this.store.dispatch({type: context.SET_CONTEXT, payload: { viewMode: view }});
  }
}
