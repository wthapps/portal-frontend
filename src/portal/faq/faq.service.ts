import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class FaqService {
  faqs$: Observable<Array<any>>;

  private _faqs = new BehaviorSubject<Array<any>>([]);

  private url = `landing/faqs`;
  constructor(private apiBaseService: ApiBaseService) {
    this.faqs$ = this._faqs.asObservable();
  }

  getAll(query: any) {
    return this.apiBaseService.get(`${this.url}`, query).subscribe((response: any) => {
      const faqs = response.data.map(c => c.attributes);
      this._faqs.next(faqs);
    });
  }
}
