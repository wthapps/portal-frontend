import {
  Component, Input, OnInit
} from '@angular/core';

@Component({
  selector: 'display-link',
  templateUrl: 'display-link.component.html',
  styleUrls: ['display-link.component.scss'],
})
export class DisplayLinkComponent implements OnInit {
  @Input() data: any;
  embedCode: any;

  ngOnInit() {
    const id = this.getId(this.data.link);
    if (id) {
      this.embedCode = '<iframe *ngIf="embedCode" width="560" height="315" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
    }
  }

  getId(url: any) {
    console.log(url);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return null;
    }
  }
}
