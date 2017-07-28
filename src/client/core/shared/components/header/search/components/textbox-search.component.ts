import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'textbox-search',
  templateUrl: 'textbox-search.component.html',
  styleUrls: ['textbox-search.component.css']
})

export class TextBoxSearchComponent implements OnInit {
  @Input() search: string = '';
  @Input() placeholder: string = '';
  @Input() showDropdown: boolean = false;
  @Input() debounceTime: any = 300;

  @Output() onEnterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEscapeEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onKeyUpEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input') input: any;


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
}
