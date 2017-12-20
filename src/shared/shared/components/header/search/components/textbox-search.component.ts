import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { Constants } from '../../../../../constant/config/constants';

declare let _: any;

@Component({
    selector: 'textbox-search',
  templateUrl: 'textbox-search.component.html',
  styleUrls: ['textbox-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TextBoxSearchComponent implements OnInit {
  @Input() search: string = '';
  @Input() placeholder: string = '';
  @Input() showSearchAdvanced: boolean = false;
  @Input() debounceTime: any = 300;

  @Output() onEnterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEscapeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onKeyUpEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchAdvancedEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input') input: any;

  searchAdvanced: boolean = false;

  tooltip:any = Constants.tooltip;

  ngOnInit() {
    Observable.fromEvent(this.input.nativeElement, 'keyup')
      .debounceTime(this.debounceTime)
      .subscribe((keyboardEvent: any) => {
        this.onKeyUp(keyboardEvent);
      });
  }

  onKeyUp(e: any) {
    if (e.code == 'Enter') {
      this.onEnter();
      return;
    }
    console.log('e.code : ', e.code);
    if (e.code == 'Escape') {
      this.onEscape();
      return;
    }
    this.onKeyUpEvent.emit({search: this.search});
  }

  onEnter() {
    this.onEnterEvent.emit({search: this.search});
  }

  onEscape() {
    this.search = '';
    this.onEscapeEvent.emit({search: this.search});
  }

  onShowSearchAdvanced() {
    this.searchAdvanced = true;
    this.onSearchAdvancedEvent.emit({
      search: this.search,
      searchAdvanced: this.searchAdvanced
    });
  }
}
