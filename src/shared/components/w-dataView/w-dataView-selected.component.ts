import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'w-dataView-selected',
  templateUrl: 'w-dataView-selected.component.html'
})
export class WDataViewSelectedComponent {
  @Input() selectedObjects: any;
  @Input() isSelectAll: boolean;
  @Output() clear: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() selectAll: EventEmitter<boolean> = new EventEmitter<boolean>(false);



  onClear() {
    this.isSelectAll = false;
    this.clear.emit(true);
  }

  onSelectAll() {
    this.isSelectAll = !this.isSelectAll;
    if (this.isSelectAll) {
      this.selectAll.emit(this.isSelectAll);
    } else {
      this.onClear();
    }
  }
}
