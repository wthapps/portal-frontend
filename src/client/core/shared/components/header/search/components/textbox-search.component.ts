import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'textbox-search',
  templateUrl: 'textbox-search.component.html',
})

export class TextBoxSearchComponent implements OnInit {
  @Input() search: string = '';
  @Input() debounceTime: any = 300;

  @Output() onEnterEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onKeyUpEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input') input: any;


  ngOnInit() {
    ////ver4 disable
    // Observable.fromEvent(this.input.nativeElement, 'keyup')
    //   .debounceTime(this.debounceTime)
    //   .subscribe((keyboardEvent: any) => {
    //     this.onKeyUp(keyboardEvent);
    //   });
    ////
  }

  onKeyUp(e: any) {
    if (e.code == 'Enter') {
      this.onEnter();
      return;
    }
    this.onKeyUpEvent.emit({search: this.search});
  }

  onEnter() {
    this.onEnterEvent.emit({search: this.search});
  }
}
