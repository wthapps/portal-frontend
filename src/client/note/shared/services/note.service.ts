import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { Note } from '../../../core/shared/models/note.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

@Injectable()
export class ZNoteService extends BaseEntityService<any> {

  notes$: Observable<any[]>;
  private notesSubject = new BehaviorSubject<Note[]>([]);

  private apiUrl = '/api/zone/note/note.json';

  constructor(protected apiBaseService: ApiBaseService,
              private http: Http) {
    super(apiBaseService);
    this.url = 'note/notes';

    this.notes$ = this.notesSubject.asObservable();
  }

  getList(): Observable<any[]> {
    // return this.apiBaseService.get(this.apiUrl)
    return this.http.get(this.apiUrl)
      .map((response: Response) => <any[]> response.json())
      .do(notes => {
        this.notesSubject.next(notes);
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
