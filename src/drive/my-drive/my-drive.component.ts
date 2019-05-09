import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'my-drive-list',
  templateUrl: './my-drive.component.html',
  styleUrls: ['./my-drive.component.scss']
})
export class MyDriveComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';

  ngOnInit() {}
}
