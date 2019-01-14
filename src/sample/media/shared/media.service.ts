import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class MMediaService {

  sliderView$: Observable<number>;
  private sliderViewSubject: BehaviorSubject<number> = new BehaviorSubject<number>(3);

  viewMode$: Observable<string>;
  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  constructor(public localStorageService: LocalStorageService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get('media_view_mode') || 'grid');

    this.sliderView$ = this.sliderViewSubject.asObservable().pipe(distinctUntilChanged());
    this.sliderViewSubject.next(this.localStorageService.get('media_slider_val') || 3);
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set('media_view_mode', view);
  }

  changeSliderView(num: number) {
    this.sliderViewSubject.next(num);
    this.localStorageService.set('media_slider_val', num);
  }
}
