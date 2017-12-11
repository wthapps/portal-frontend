import { Component, OnInit, HostBinding, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
;
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as note from '../actions/note';
import * as fromRoot from '../reducers/index';
import { Constants } from '@shared/constant/config/constants';
import { ZNoteService } from '../services/note.service';

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

  constructor(private noteService: ZNoteService, private store: Store<fromRoot.State>) {
    // this.noteService.viewOption$.subscribe((viewOption: any)=> {
    //   this.viewOption = viewOption;
    // });
    this.viewMode$ = this.store.select(fromRoot.getViewMode);
  }

  ngOnInit() {

  }

  onChangeView(view: string) {
    // this.noteService.changeModeView(view);
    this.store.dispatch(new note.ChangeViewMode(view));
  }
}
