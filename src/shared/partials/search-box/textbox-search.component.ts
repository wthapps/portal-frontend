import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Renderer2
} from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Constants } from '../../constant/config/constants';

declare let _: any;

@Component({
  selector: 'textbox-search',
  templateUrl: 'textbox-search.component.html',
  styleUrls: ['textbox-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextBoxSearchComponent implements OnInit {
  @Input() search = '';
  @Input() placeholder = '';
  @Input() showSearchAdvanced: Boolean = false;
  @Input() showSearchClearText: Boolean = false;
  @Input() debounceTime: any = 300;

  @Output() onEnterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEscapeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onKeyUpEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchAdvancedEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input') input: any;

  searchAdvanced = false;

  tooltip: any = Constants.tooltip;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(debounceTime(this.debounceTime))
      .subscribe((keyboardEvent: any) => {
        this.onKeyUp(keyboardEvent);
      });
  }

  onKeyUp(e: any) {
    // Enter key
    if (e.keyCode === 13) {
      this.onEnter();
      return;
    }
    // Escape key
    if (e.keyCode === 27) {
      this.onEscape();
      return;
    }
    this.onKeyUpEvent.emit({ search: this.search });
  }

  onEnter() {
    if (this.search) {
      this.onEnterEvent.emit({ search: this.search });
    }
  }

  onEscape() {
    this.search = '';
    this.onEscapeEvent.emit({ search: this.search });

    const headerNav = document.querySelector('.header-nav');

    this.renderer.removeClass(headerNav, 'header-nav-xs-show-search');
  }

  onShowSearchAdvanced() {
    this.searchAdvanced = true;
    this.onSearchAdvancedEvent.emit({
      search: this.search,
      searchAdvanced: this.searchAdvanced
    });
  }
}
