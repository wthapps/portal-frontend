import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiBaseService } from '@shared/services/apibase.service';
import { map } from 'rxjs/operators';

@Injectable()
export class StorageService {

  /**
   * Current storage
   */
  currentStorage$: Observable<any>;
  private currentStorageSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private apiBaseService: ApiBaseService) {
    this.currentStorage$ = this.currentStorageSubject$.asObservable();
  }

  getAll(): Observable<any> {
    return this.apiBaseService.get(`account/storages`).pipe(map(response => {
      return response.data.map(item => item.attributes);
    }));
  }

  getCurrent(): Observable<any> {
    return this.apiBaseService.get('account/storages/get_current').pipe(map(response => {
      const storage = response.data.attributes;
      this.setCurrentStorage(storage);
      return storage;
    }));
  }

  getCurrentStorage() {
    this.currentStorageSubject$.getValue();
  }

  setCurrentStorage(storage: any) {
    this.currentStorageSubject$.next(storage);
  }
}
