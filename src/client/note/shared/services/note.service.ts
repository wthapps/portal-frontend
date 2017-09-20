import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { Note } from '../../../core/shared/models/note.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;

@Injectable()
export class ZNoteService extends BaseEntityService<any> {

  notes$: Observable<any[]>;
  viewOption$: Observable<string>;
  selectedObjects$: Observable<Note[]>;
  isSelectAll$: Observable<boolean>;

  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private viewOptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('list');
  private selectedObjectsSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private isSelectAllSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private apiUrl = '/api/zone/note/note.json';

  constructor(protected apiBaseService: ApiBaseService,
              private http: Http) {
    super(apiBaseService);
    this.url = 'note/notes';

    this.notes$ = this.notesSubject.asObservable();
    this.viewOption$ = this.viewOptionSubject.asObservable();
    this.selectedObjects$ = this.selectedObjectsSubject.asObservable();
    this.isSelectAll$ = this.isSelectAllSubject.asObservable();
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


  changeModeView(mode: string = 'list') {
    this.viewOptionSubject.next(mode);
  }

  addItemSelectedObjects(item: any) {
    let data: any = this.selectedObjectsSubject.getValue();
    data.unshift(item);
    this.selectedObjectsSubject.next(data);
    this.checkSelectAll();
  }

  removeItemSelectedObjects(item: any) {
    let collection: any = this.selectedObjectsSubject.getValue();
    collection = collection.filter(
      (v: any) => v.id !== item.id
    );
    this.selectedObjectsSubject.next(collection);
  }

  onSelectAll() {
    this.selectedObjectsSubject.getValue().length = 0;

    if (this.isSelectAllSubject.getValue()) {
      this.isSelectAllSubject.next(false);
    } else {
      this.isSelectAllSubject.next(true);
      let notesData: any = this.notesSubject.getValue();
      this.selectedObjectsSubject.next(_.cloneDeep(notesData.data));
    }
  }

  checkSelectAll() {
    let notesData: any = this.notesSubject.getValue();
    let selectedObjectsData: any = this.selectedObjectsSubject.getValue();
    if (selectedObjectsData.length === notesData.data.length) {
      this.isSelectAllSubject.next(true);
    }
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
