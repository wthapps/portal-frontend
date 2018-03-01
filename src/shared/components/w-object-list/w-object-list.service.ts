import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare let _: any;

@Injectable()
export class WObjectListService {
  view$: any;
  private viewSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  selectedObjects$: any;
  private selectedObjectsSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  groupBy$: any;
  private groupBySubject: BehaviorSubject<any> = new BehaviorSubject<any>('object_type');

  sortBy$: any;
  private sortBySubject: BehaviorSubject<any> = new BehaviorSubject<any>('created_at');

  sortOrder$: any;
  private sortOrderSubject: BehaviorSubject<any> = new BehaviorSubject<any>('desc');

  multipleSelection$: any;
  private multipleSelectionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.view$ = this.viewSubject.asObservable();
    this.selectedObjects$ = this.selectedObjectsSubject.asObservable();
    this.multipleSelection$ = this.multipleSelectionSubject.asObservable();

    this.groupBy$ = this.groupBySubject.asObservable();
    this.sortBy$ = this.sortBySubject.asObservable();
    this.sortOrder$ = this.sortOrderSubject.asObservable();
  }

  changeView(view: string) {
    this.viewSubject.next(view);
  }

  addItem(item: any) {
    let items = this.selectedObjectsSubject.getValue().concat([item]);
    this.selectedObjectsSubject.next(items);
  }

  addOrRemoveItem(item: any) {
    if (_.find(this.selectedObjectsSubject.getValue(), {'id': item.id})) {
      _.remove(this.selectedObjectsSubject.getValue(), {'id': item.id});
    } else {
      let items = this.selectedObjectsSubject.getValue().concat([item]);
      this.selectedObjectsSubject.next(items);
    }
  }

  setGroupBy(groupBy: string) {
    this.groupBySubject.next(groupBy);
  }

  setSortBy(sortBy: string) {
    this.sortBySubject.next(sortBy);
  }

  setSortOrder(sortOrder: string) {
    this.sortOrderSubject.next(sortOrder);
  }

  setMultipleSelection(event: boolean) {
    this.multipleSelectionSubject.next(event);
  }

  removeItem(id: any) {
    _.remove(this.selectedObjectsSubject.getValue(), {'id': id});
  }

  clear() {
    this.selectedObjectsSubject.next([]);
  }

  getSelectedObjects() {
    return this.selectedObjectsSubject.getValue();
  }
}

