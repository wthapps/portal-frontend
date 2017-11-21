import { Output, EventEmitter } from '@angular/core';

export class SubmitMixin {
  @Output() eventOut: EventEmitter<any>;

  onSubmit(values: any) {
    this.eventOut.emit(values);
  }
}
