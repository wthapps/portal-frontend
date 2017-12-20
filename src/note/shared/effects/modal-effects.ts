import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ApiBaseService } from '@shared/services/apibase.service';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { Filters } from '../reducers/note';
import { ZNoteService } from '../services/note.service';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


import * as modal from '../actions/modal';
import * as fromRoot from '../reducers/index';
import { CommonEventService } from '@shared/services/common-event/common-event.service';


@Injectable()
export class ModalEffects {
  constructor(private actions: Actions, public noteService: ZNoteService, private apiBaseService: ApiBaseService,
              private commonEventService: CommonEventService,
              private store: Store<fromRoot.State>) {
  }

}
