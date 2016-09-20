import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';


@Component({
  moduleId: module.id,
  selector: 'page-zone-picture',
  templateUrl: 'picture.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPictureComponent {

  advSearch: boolean = false;

  toggleShowSearch(event): void {
    this.advSearch = (this.advSearch == true ? false : true);
  }

  agreed = 0;
  disagreed = 0;
  onVoted(agreed: boolean) {
    agreed ? this.agreed++ : this.disagreed++;
  }
}
