import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare let _: any;

@Injectable()
export class WObjectListService {
  view$: any;
  private viewSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  selectedObjects$: Observable<any>;
  private selectedObjectsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  groupBy$: Observable<any>;
  private groupBySubject: BehaviorSubject<any> = new BehaviorSubject<any>('object_type');

  sortBy$: Observable<any>;
  private sortBySubject: BehaviorSubject<any> = new BehaviorSubject<any>('created_at');

  sortOrder$: Observable<'asc' | 'desc' | boolean>;
  private sortOrderSubject: BehaviorSubject<'asc' | 'desc' | boolean> = new BehaviorSubject<any>('desc');

  multipleSelection$: Observable<any>;
  private multipleSelectionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  objectsDisabled$: Observable<any>;
  private objectsDisabledSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  selectedEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.view$ = this.viewSubject.asObservable();
    this.selectedObjects$ = this.selectedObjectsSubject.asObservable();
    this.multipleSelection$ = this.multipleSelectionSubject.asObservable();
    this.objectsDisabled$ = this.objectsDisabledSubject.asObservable();

    this.groupBy$ = this.groupBySubject.asObservable();
    this.sortBy$ = this.sortBySubject.asObservable();
    this.sortOrder$ = this.sortOrderSubject.asObservable();
  }

  changeView(view: string) {
    this.viewSubject.next(view);
  }

  addItem(item: any) {
    const items = this.selectedObjectsSubject.getValue().concat([item]);
    this.selectedObjectsSubject.next(items);
  }

  addOrRemoveItem(item: any) {
    if (_.find(this.selectedObjectsSubject.getValue(), {'id': item.id})) {
      _.remove(this.selectedObjectsSubject.getValue(), {'id': item.id});
    } else {
      const items = this.selectedObjectsSubject.getValue().concat([item]);
      this.selectedObjectsSubject.next(items);
    }
  }

  setSelectedObjects(items: any) {
    this.selectedObjectsSubject.next(items);
  }

  setGroupBy(groupBy: string) {
    this.groupBySubject.next(groupBy);
  }

  setSortBy(sortBy: string) {
    this.sortBySubject.next(sortBy);
  }

  setSortOrder(sortOrder: 'asc' | 'desc' | boolean) {
    this.sortOrderSubject.next(sortOrder);
  }

  setMultipleSelection(event: boolean) {
    this.multipleSelectionSubject.next(event);
  }

  setObjectsDisabled(data: string[]) {
    this.objectsDisabledSubject.next(data);
  }

  removeItem(id: any) {
    // _.remove(this.selectedObjectsSubject.getValue(), {'id': id});
    const filteredItems = this.selectedObjectsSubject.getValue().filter(item => item.id !== id);
    this.selectedObjectsSubject.next(filteredItems);
  }

  clear() {
    if (this.selectedObjectsSubject.getValue().length !== 0) {
      this.selectedObjectsSubject.next([]);
    }
    this.selectedEvent.emit({ type: 'close' });
  }

  getSelectedObjects() {
    return this.selectedObjectsSubject.getValue();
  }
}

