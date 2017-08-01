import { Component, Input, EventEmitter, Output } from '@angular/core';
import { EmitEventMixin } from "../../../core/shared/mixins/shared/emit-event.mixin";
import { Mixin } from "../../../core/design-patterns/decorator/mixin-decorator";


declare var _: any;
@Mixin([EmitEventMixin])
@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-actions-bar',
  templateUrl: 'actions-bar.component.html'
})

export class ZContactSharedActionsBarComponent implements EmitEventMixin {
  // Show or not
  @Input() showSocial: boolean = true;
  @Input() showChat: boolean = true;
  @Input() showNumber: boolean = true;
  @Input() showViewDetail: boolean = false;
  @Input() showEdit: boolean = false;

  // Toggle
  @Input() toggleFavourite: boolean = false;
  @Input() toggleBlacklist: boolean = false;
  // Number
  @Input() number: number;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  emitEvent: (value: any) => void;
}
