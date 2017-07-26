
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Mixin } from "../../../../core/design-patterns/decorator/mixin-decorator";
import { EmitEventMixin } from "../../../../core/shared/mixins/shared/actions.mixin";

declare var _: any;

@Mixin([EmitEventMixin])
@Component({
  moduleId: module.id,
  selector: 'message-request-item',
  templateUrl: 'message-request-item.component.html'
})

export class MessageItemRequestComponent implements EmitEventMixin {
  @Input() data: any;
  @Input() avatar: string;
  @Input() url: string;
  @Input() name: string;
  @Input() text: string;

  @Output() eventOut = new EventEmitter<any>();
  emitEvent:(values: any) => void;
}
