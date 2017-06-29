import {
  Component, Input, OnInit
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'display-link',
  templateUrl: 'display-link.component.html',
  styleUrls: ['display-link.component.css'],
})
export class DisplayLinkComponent implements OnInit {
  @Input() data:any;
  embedCode: any;

  ngOnInit() {
    let id = this.getId(this.data.link);
    if (id) {
      this.embedCode = '<iframe *ngIf="embedCode" width="560" height="315" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
    }
  }

  getId(url: any) {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return null;
    }
  }
}
