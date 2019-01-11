import { Component, Input } from '@angular/core';

@Component({
  selector: 'w-dataView-selected',
  templateUrl: 'w-dataView-selected.component.html'
})
export class WDataViewSelectedComponent {
  @Input() selectedObjects: any = [];
}
