import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'drive-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class DriveFolderListComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';

  ngOnInit() {}
}
