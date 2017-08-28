import { Component, Input, EventEmitter, Output } from '@angular/core';
import { EmitEventMixin } from '../../../core/shared/mixins/shared/emit-event.mixin';
import { Mixin } from '../../../core/design-patterns/decorator/mixin-decorator';
import { Constants } from '../../../core/shared/config/constants';


declare var _: any;
@Mixin([EmitEventMixin])
@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css']
})

export class ZContactSharedActionsBarComponent implements EmitEventMixin {
  // Show or not
  @Input() showSocial: boolean = true;
  @Input() showChat: boolean = true;
  @Input() showNumber: boolean = true;
  @Input() showViewDetail: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showTag: boolean = true;
  @Input() showInvitation: boolean = true;
  // Toggle
  @Input() toggleFavourite: boolean = false;
  @Input() toggleBlacklist: boolean = false;
  // Number
  @Input() number: number;
  // Order
  @Input() order: boolean = false;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  emitEvent: (value: any) => void;

  tooltip: any = Constants.tooltip;
}
