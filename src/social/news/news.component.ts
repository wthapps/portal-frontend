import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
})

export class ZSocialNewsComponent implements OnInit {
  article: any = {
    uri: 'https://i-kinhdoanh.vnecdn.net/2018/01/10/biencam1-3203-1515575867_140x84.jpg'
  };

  constructor() {
  }

  ngOnInit() {
  }
}
