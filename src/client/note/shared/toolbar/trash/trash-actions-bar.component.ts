import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import * as note from '../../actions/note';
import * as fromRoot from '../../reducers/index';

import { Constants } from '../../../../core/shared/config/constants';
import { ZNoteService } from '../../services/note.service';
import { WthConfirmService } from '../../../../core/shared/components/confirmation/wth-confirm.service';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-trash-actions-bar',
  templateUrl: 'trash-actions-bar.component.html',
  styleUrls: ['trash-actions-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZNoteSharedTrashActionBarComponent implements OnInit {
  @Input() selectedObjects: any[] = [];

  readonly tooltip: any = Constants.tooltip;

  constructor(public noteService: ZNoteService,
              private wthConfirm: WthConfirmService,
              private store: Store<fromRoot.State>,
              public commonEventService: CommonEventService) {
  }

  ngOnInit() {
  }

  permanentDelete() {
    console.debug('inside permanent delete !!!');
    this.store.dispatch({type: note.PERMANENT_DELETE, payload: this.selectedObjects});
  }

  restore() {
    console.debug('inside restore !!!');
    this.store.dispatch({type: note.RESTORE, payload: this.selectedObjects});
  }

}
