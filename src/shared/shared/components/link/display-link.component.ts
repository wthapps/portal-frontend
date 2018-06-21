import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'display-link',
  templateUrl: 'display-link.component.html',
  styleUrls: ['display-link.component.scss']
})
export class DisplayLinkComponent implements OnInit {
  @Input() data: any;
  embedCode: any;

  ngOnInit() {
    const id = this.getId(this.data.link);
    if (id) {
      this.embedCode =
        '<div class="embed-responsive embed-responsive-16by9">\n' +
        '  <iframe class="embed-responsive-item" src="//www.youtube.com/embed/' + id + '">' +
        '</iframe>\n' +
        '</div>';
    }
  }

  getId(url: any) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return null;
    }
  }
}
