import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PhotoDetailModalComponent } from '../modal/photo-detail-modal.component';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var $: any;
declare var _: any;
const KEY_ESC = 27;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'photo-detail-wrapper',
  templateUrl: 'photo-detail-wrapper.component.html',
  styleUrls: ['photo-detail-wrapper.component.css']
})
export class PhotoDetailWrapperComponent implements OnInit, OnDestroy {
  events:any;
  photo:any;
  @ViewChild('photoDetailModal') photoDetailModal: PhotoDetailModalComponent;

  constructor(private router: Router, private apiBaseService: ApiBaseService) {

  }

  ngOnInit() {
    this.events = this.router.events
      .filter((event:any) => event instanceof NavigationEnd)
      .subscribe((event:NavigationEnd) => {
        let paths = event.url.toString().split('/');
        if (paths[2]) {
          this.apiBaseService.get('zone/social_network/photos/' + paths[2]).subscribe((res:any) => {
            console.log(res);
            this.photo = res.data;
            this.photoDetailModal.open({show: true});
          });
        }
      });
  }

  ngOnDestroy() {
    this.events.unsubscribe();
  }
}
