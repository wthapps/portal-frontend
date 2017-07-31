import { Output, EventEmitter } from '@angular/core';

export class EmitEventMixin {
  @Output() eventOut: EventEmitter<any>;

  emitEvent(values: any) {
    this.eventOut.emit(values);
  }
}
