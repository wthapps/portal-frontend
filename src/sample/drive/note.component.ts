import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FileUploadService } from '@shared/services/file-upload.service';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoteComponent implements OnInit {
  files = [];
  constructor(private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
  }
}
