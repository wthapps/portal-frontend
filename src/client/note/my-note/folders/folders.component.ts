import { Component, OnInit } from '@angular/core';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';

@Component({
  moduleId: module.id,
  selector: 'z-note-my-note-folders',
  templateUrl: 'folders.component.html'
})
export class ZNoteMyNoteFoldersComponent implements OnInit {
  data: any;

  constructor(private commonEventService: CommonEventService) {
  }

  ngOnInit() {
    this.commonEventService.filter((event: any) => event.channel == 'noteActionsBar').subscribe((event: any) => {
      console.log(event);
    });
  }

  createNote() {
    console.log('creating::: note');
  }
}
