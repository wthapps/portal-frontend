
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Mixin } from "../../../../core/design-patterns/decorator/mixin-decorator";
import { EmitEventMixin } from "../../../../core/shared/mixins/shared/emit-event.mixin";

declare var _: any;

@Mixin([EmitEventMixin])
@Component({
  moduleId: module.id,
  selector: 'message-actions-item',
  templateUrl: 'message-actions-item.component.html'
})

export class MessageItemActionComponent implements EmitEventMixin {
  @Input() data: any = "Pass data you want return";
  @Input() avatar: string;
  @Input() url: string;
  @Input() name: string;
  @Input() text: string;
  @Input() status: string;
  @Input() actions: any = [];

  @Output() eventOut = new EventEmitter<any>();
  emitEvent:(values: any) => void;
}
