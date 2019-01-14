import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'w-dataView-selected',
  templateUrl: 'w-dataView-selected.component.html'
})
export class WDataViewSelectedComponent {
  @Input() selectedObjects: any;
  @Output() clear: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  onClear() {
    this.clear.emit(true);
  }
}
