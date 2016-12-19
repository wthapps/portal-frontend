import { Component, OnInit } from '@angular/core';
import { ZMediaService } from '../media.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  data: any = [];
  nextLink: string = null;

  constructor(private mediaService: ZMediaService) {
  }

  ngOnInit() {
    this.mediaService.listPhoto().subscribe((res: any)=> {
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
      console.log(this);
    });
  }


  onLoadMore(event: any) {
    event.preventDefault();
    this.mediaService.loadMore(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v)=> {
        this.data.push(v);
      });
      this.nextLink = res.page_metadata.links.next;
      console.log(this);
    });
  }

}
