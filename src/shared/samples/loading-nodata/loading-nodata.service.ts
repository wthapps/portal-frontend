import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoadingNodataService {
  data$: Observable<any>;
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  constructor(private http: HttpClient) {
    this.data$ = this.dataSubject.asObservable();
  }

  clear() {
    this.dataSubject.next(null);
  }

  getData(url: string, next: string = null) {
    let dataUrl = url;
    if (next) {
      dataUrl = `${dataUrl}?after=${next}`;
    }

    return this.http.get(dataUrl)
      .pipe(
        map((res: any) => {
          // res.data.children.map((v: any) => v.data);
          return res.data;
        }),
        tap((res: any) => {
          let newData = [];
          if (this.dataSubject.getValue()) {
            newData = this.dataSubject.getValue().concat(res.children);
          } else {
            newData = res.children;
          }
          this.dataSubject.next(newData);
        })
      );
  }
}

