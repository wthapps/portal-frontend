import { Component, OnInit, HostBinding } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';
import { ZNoteService } from '../services/note.service';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ZNoteSharedToolBarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';

  tooltip: any = Constants.tooltip;

  viewOption: string = 'list';

  constructor(private noteService: ZNoteService) {
    this.noteService.viewOption$.subscribe((viewOption: any)=> {
      this.viewOption = viewOption;
    });
  }

  ngOnInit() {

  }

  onChangeView(view: string) {
    this.noteService.changeModeView(view);
  }
}
