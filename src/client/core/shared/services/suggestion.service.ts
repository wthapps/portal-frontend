import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

declare var _: any;

@Injectable()
/**
 * This service works as a bridge between search component in CORE with specific module services. Ex: ContactSearch + ContactService
 */
export class SuggestionService {

  private inputSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private suggestSubject: BehaviorSubject<any[]> = new BehaviorSubject([]);

  public input$: Observable<string> = this.inputSubject.asObservable();
  public suggest$: Observable<any[]> = this.suggestSubject.asObservable();

  constructor() {

  }

  public setInput(input: string) {
    this.inputSubject.next(input);
  }

  public getInput(): string {
    return this.inputSubject.getValue();
  }

  public setSuggestion(suggestions: any[]): void {
    return this.suggestSubject.next(suggestions);
  }

  public getSuggestion(): any[] {
    return this.suggestSubject.getValue();
  }

}
