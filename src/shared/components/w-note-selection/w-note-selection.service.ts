import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { ApiBaseService } from '@shared/services';
import { Note } from '@shared/shared/models/note.model';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

declare let _: any;

@Injectable()
export class WNoteSelectionService {
  notes$: Observable<any>;
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>(null);

  selectedNotes$: Observable<any[]>;
  private selectedNotesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  open$: Observable<any>;
  private openSubject: Subject<any> = new Subject<any>();

  constructor(private apiBaseService: ApiBaseService,
              private objectListService: WObjectListService,
              private datePipe: DatePipe) {
    this.notes$ = this.notesSubject.asObservable();
    this.selectedNotes$ = this.selectedNotesSubject.asObservable();
    this.open$ = this.openSubject.asObservable();
  }

  open() {
    this.openSubject.next(true);
  }

  close() {

  }

  getData(url: string) {
    return this.apiBaseService.get(url)
      .pipe(
        map((res: ResponseMetaData) => {
          res.data = res.data.map(
            (item: any) => (
              {
                ...item,
                group_by_day: this.datePipe.transform(item.created_at, 'yyyy-MM-dd'),
                group_by_month: this.datePipe.transform(item.created_at, 'yyyy-MM'),
                group_by_year: this.datePipe.transform(item.created_at, 'yyyy')
              }
            ));
          return res;
        }),
        tap((res: any) => {
          console.log(res);
          let newData = [];
          if (this.notesSubject.getValue()) {
            newData = this.notesSubject.getValue().concat(res.data);
          } else {
            newData = res.data;
          }
          this.notesSubject.next(newData);
        })
      );
  }

  setSelectedNotes(medias: Note[]) {
    const newMedias = this.notesSubject.getValue().filter((media: any) => {
      return medias.some((m: any) => {
        return (media.id === m.id && media.object_type === m.object_type);
      });
    });
    this.selectedNotesSubject.next(newMedias);
  }

  clear() {
  }
}

