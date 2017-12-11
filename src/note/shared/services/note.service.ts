import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { BaseEntityService } from '@shared/shared/services/base-entity-service';
import { Note } from '@shared/shared/models/note.model';
import { ApiBaseService } from '@shared/shared/services/apibase.service';

declare var _: any;

@Injectable()
export class ZNoteService extends BaseEntityService<any> {

  notes$: Observable<any[]>;
  viewOption$: Observable<string>;
  selectedObjects$: Observable<Note[]>;
  isSelectAll$: Observable<boolean>;
  modalEvent$: Observable<any>;

  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private viewOptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('list');
  private selectedObjectsSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private isSelectAllSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private modalEventSubject: BehaviorSubject<any> = new BehaviorSubject<any>({action: '', item: null});

  private apiUrl = '/api/zone/note/note.json';

  constructor(protected apiBaseService: ApiBaseService,
              private http: Http) {
    super(apiBaseService);
    this.url = 'note/notes';

    this.notes$ = this.notesSubject.asObservable();
    this.viewOption$ = this.viewOptionSubject.asObservable();
    this.selectedObjects$ = this.selectedObjectsSubject.asObservable();
    this.isSelectAll$ = this.isSelectAllSubject.asObservable();
    this.modalEvent$ = this.modalEventSubject.asObservable();
  }

  multiDelete(body: any): Observable<any> {
    return this.apiBaseService.post(`${this.url}/multi_delete`, {objects: body});
  }

  getList(): Observable<any[]> {
    // set selectedObjectsSubject is empty
    this.selectedObjectsSubject.getValue().length = 0;

    // set onSelectAll is false
    this.isSelectAllSubject.next(false);

    // return this.apiBaseService.get(this.apiUrl)
    return this.http.get(this.apiUrl)
      .map((response: Response) => <any[]> response.json())
      .do(notes => {
        this.notesSubject.next(notes);
      })
      .catch(this.handleError);
  }

  deleteNote(body?: any) {
    /*return this.apiBaseService.delete(`${this.url}/${body.id}`)
     .do(deletedNote => {
     if (deletedNote) {
     let collection: any = this.notesSubject.getValue();
     collection.data = collection.data.filter(
     (v: any) => v.id !== body.id
     );
     this.notesSubject.next(collection);
     }
     });*/

    let collection: any = this.notesSubject.getValue();
    if (body) { // deleted 1 note
      collection.data = collection.data.filter(
        (v: any) => v.id !== body.id
      );

      // update notesSubject
      this.notesSubject.next(collection);

      // update selectedObjectsSubject
      _.remove(this.selectedObjectsSubject.getValue(), {'id': body.id});

    } else { // deleted selectedObjects

      // remove item from notesSubject
      _.map(this.selectedObjectsSubject.getValue(), (v: any)=> {
        _.remove(collection.data, {'id': v.id});
      });

      // set selectedObjectsSubject is empty
      this.selectedObjectsSubject.getValue().length = 0;
    }

    // set onSelectAll is false
    if (collection.data.length == 0) {
      this.isSelectAllSubject.next(false);
    }
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

    if (collection.length == 0) {
      this.isSelectAllSubject.next(false);
    }
  }

  changeSortOption(name: string, descending: boolean) {
    let collection: any = this.notesSubject.getValue();
    collection.data = _.orderBy(collection.data, [name], [(descending ? 'desc' : 'asc')]);
    this.notesSubject.next(collection);
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

  restore(body: any) {
    return this.apiBaseService.post(`note/trashs/restore`, {objects: body});
  }

  permanentDelete(body: any) {
    return this.apiBaseService.post(`note/trashs/permanent_delete`, {objects: body});
  }

  modalEvent(event: any) {
    this.modalEventSubject.next(event);
  }


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
