
import { Component, Input } from "@angular/core";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'message-simple-item',
  templateUrl: 'message-simple-item.component.html'
})

export class MessageItemSimpleComponent {
  @Input() data: string;

}
