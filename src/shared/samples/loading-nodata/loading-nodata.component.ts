import { Component, OnInit } from '@angular/core';
import { LoadingNodataService } from '@shared/samples/loading-nodata/loading-nodata.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'loading-nodata',
  templateUrl: 'loading-nodata.component.html'
})
export class LoadingNodataComponent implements OnInit {
  data$: Observable<any[]>;
  isLoading: boolean;
  url: string;
  next: any;

  constructor(private loadingNodataService: LoadingNodataService) {
    this.data$ = this.loadingNodataService.data$;
  }

  ngOnInit(): void {
    this.url = 'https://www.reddit.com/r/todayilearned/top.json';
    this.next = null;
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.loadingNodataService.getData(this.url, this.next)
      .subscribe(
        (res: any) => {
          if (res) {
            this.next = res.after;
          }
        },
        err => console.log(err),
        () => this.isLoading = false
      );
  }

  loadData(topic: string) {
    this.loadingNodataService.clear();
    this.url = `https://www.reddit.com/r/${topic}/top.json`;
    this.next = null;
    this.getData();
  }

  onLoadMore() {
    this.getData();
  }
}
