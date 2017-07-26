import { Output, EventEmitter } from '@angular/core';

export class SubmitMixin {
  @Output() eventOut: EventEmitter<any>;

  onSubmit(values: any) {
    this.eventOut.emit(values);
  }
}

export class EmitEventMixin {
  @Output() eventOut: EventEmitter<any>;

  emitEvent(values: any) {
    this.eventOut.emit(values);
  }
}
