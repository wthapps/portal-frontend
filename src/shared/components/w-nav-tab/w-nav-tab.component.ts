import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

export interface WTab {
  name: string;
  link: string;
  icon: string;
  type: string;
}

@Component({
  selector: 'w-nav-tab',
  templateUrl: 'w-nav-tab.component.html',
  styleUrls: ['w-nav-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WNavTabComponent implements OnInit {
  @Input() tabs: WTab[];
  @Output() currentTab: EventEmitter<WTab> = new EventEmitter<WTab>();
  tabActive: WTab;


  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  onTab(tab: WTab) {
    this.tabActive = tab;

    if (tab.type === 'link') {
      this.router.navigateByUrl(tab.link);
    } else {
      this.currentTab.emit(tab);
    }
  }
}

