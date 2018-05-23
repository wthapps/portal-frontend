import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';

@Component({
  selector: 'w-nav-tab',
  templateUrl: 'w-nav-tab.component.html',
  styleUrls: ['w-nav-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WNavTabComponent implements OnInit, OnChanges {
  @Input() tabs: WTab[];
  @Input() setTabActive: string;
  @Output() currentTab: EventEmitter<WTab> = new EventEmitter<WTab>();
  tabActive: WTab;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const link = this.setTabActive;
    const tab = this.tabs.find((obj: WTab) => {
      return obj.link === link;
    });
    if (tab) {
      this.tabActive = tab;
    }
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

