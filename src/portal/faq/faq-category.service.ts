import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiBaseService } from '@shared/services';



@Injectable()
export class FaqCategoryService {

  categories$: Observable<Array<any>>;

  private _categories = new BehaviorSubject<Array<any>>([]);

  private url = `landing/faq_categories`;
  constructor(private apiBaseService: ApiBaseService) {
    this.categories$ = this._categories.asObservable();
  }

  getAll(query: any) {
    return this.apiBaseService.get(`${this.url}`, query).subscribe((response: any) => {
      const cats = response.data.map(c => c.attributes);
      this._categories.next(cats);
    });
  }
}
