import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { PhotoEditComponent } from './edit-photo.component';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var $: any;
declare var _: any;
const KEY_ESC = 27;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'photo-edit-wrapper',
  templateUrl: 'photo-edit-wrapper.component.html'
})
export class PhotoEditWapperComponent implements OnInit, OnDestroy {
  events:any;
  photo:any;
  @ViewChild('photoEditComponent') photoEditComponent: PhotoEditComponent;

  constructor(private router: Router, private apiBaseService: ApiBaseService) {

  }

  ngOnInit() {
    this.events = this.router.events
      .filter((event:any) => event instanceof NavigationEnd)
      .subscribe((event:NavigationEnd) => {
        let paths = event.url.toString().split('/');
        if (paths[2]) {
          this.apiBaseService.get('zone/social_network/photos/' + paths[2]).subscribe((res:any) => {
            this.photo = res.data;
          });
        }
      });
  }

  ngOnDestroy() {
    this.events.unsubscribe();
  }
}
