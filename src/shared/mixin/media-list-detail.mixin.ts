import { ApiBaseService, WthConfirmService, UrlService } from '@shared/services';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
/* MediaListDetailMixin for album detail, playlist detaill*/
export class MediaListDetailMixin {
  object: any;
  showDetailsInfo: any;
  returnUrls: any;

  constructor(public router: Router, public route: ActivatedRoute, public location: Location) { }

  loadObject(input?: any) {
    throw new Error('Should be overwrite');
  }

  toggleInfo() {
    this.showDetailsInfo = !this.showDetailsInfo;
  }

  back() {
    if (this.returnUrls && this.returnUrls !== 'undefined') {
      if (typeof this.returnUrls === 'string') {
        this.router.navigate([this.returnUrls]);
      } else {
        const link = this.returnUrls.pop();
        this.router.navigate([link], { queryParams: { returnUrls: this.returnUrls } });
      }
    } else {
      const outlet = this.route.snapshot.outlet;
      if (outlet !== 'primary')
        this.router.navigate([{ outlets: { [outlet]: null } }]);
      else this.location.back();
    }
  }
}
