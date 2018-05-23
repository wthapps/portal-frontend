import {
  Component,
  OnInit,
  HostBinding,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Constants } from '@shared/constant';

@Component({
  selector: 'chat-note-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatNoteSharedToolBarComponent {
  tooltip: any = Constants.tooltip;
  viewMode: string = 'list';
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  onChangeView(view: string) {
    this.viewMode = view;
    this.events.emit({type: 'viewChange', payload: view});
  }
}
