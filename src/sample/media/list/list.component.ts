import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { SampleMediaService } from '../shared/media.service';
import { ActivatedRoute } from '@angular/router';
import { WDataViewComponent } from '../../shared/w-dataView/w-dataView.component';

@Component({
  selector: 's-media-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class SampleMediaListComponent implements OnInit {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;

  sliderView = 3;
  data: any[] = null;
  next: string;

  constructor(private mediaService: SampleMediaService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params.get('type'));
    });

    this.getDataAsync().then();
  }

  async getDataAsync() {
    const data = await this.mediaService.getData(this.next).toPromise();
    this.next = data.meta.links.next;
    this.data = this.data ? [...this.data, ...data.data] : data.data;
  }

  onLoadMoreCompleted(event: any) {
    console.log(this.next, this.dataView);
    if (event && this.next) {
      this.getDataAsync().then();
    }
  }
}
