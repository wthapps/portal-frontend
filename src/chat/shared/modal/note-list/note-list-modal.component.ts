import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'chat-note-list-modal',
  templateUrl: './note-list-modal.component.html'
  // styleUrls: ['./note-list-modal.component.css']
})
export class ChatNoteListModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

  constructor() {}

  ngOnInit() {}
}
