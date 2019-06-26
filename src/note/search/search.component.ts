import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';


import * as context from '../shared/reducers/context';
import * as fromNote from '../shared/actions/note';
import { ApiBaseService } from '@shared/services/apibase.service';
import { NoteConstants, noteConstants } from '@notes/shared/config/constants';

@Component({
  selector: 'z-note-search',
  templateUrl: 'search.component.html'
})
export class ZNoteSearchComponent implements OnInit {

  noteConstants: NoteConstants = noteConstants;

  constructor(private store: Store<any>,
              private route: ActivatedRoute,
              private apiBaseService: ApiBaseService) {
    this.route.queryParamMap.forEach(queryParamMap => {
      this.getSearchResult(queryParamMap.get('q'));
    });
  }

  ngOnInit() {
  }

  getSearchResult(q: string): Promise<any> {
    return this.apiBaseService
      .get(`note/search`, { q })
      .toPromise().then((res: any) => {
        this.store.dispatch(new fromNote.LoadSuccess(res.data));
        this.store.dispatch({
          type: context.SET_CONTEXT,
          payload: {
            page: this.noteConstants.PAGE_SEARCH,
            pathTitle: 'Search result',
            permissions: this.noteConstants.PAGE_PERMISSIONS.SEARCH,
            noData: this.noteConstants.NO_DATA.SEARCH
          }
        });
      });
  }
}
