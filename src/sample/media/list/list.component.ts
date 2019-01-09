import { Component, HostBinding, OnInit } from '@angular/core';
import { SampleMediaService } from '../shared/media.service';

@Component({
  selector: 's-media-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class SampleMediaListComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';
  sliderView = 3;
  data: any[] = null;
  next: string;

  constructor(private mediaService: SampleMediaService) {
  }

  ngOnInit(): void {
    this.getDataAsync().then();
  }

  async getDataAsync() {
    const data = await this.mediaService.getData(this.next).toPromise();
    this.next = data.meta.links.next;
    this.data = this.data ? [...this.data, ...data.data] : data.data;
  }

  onLoadMoreCompleted(event: any) {
    console.log(this.next);
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }
}
