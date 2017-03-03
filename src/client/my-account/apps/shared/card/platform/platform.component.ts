import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'ac-apps-shared-platform',
  templateUrl: 'platform.component.html'
})
export class ACAppsSharedCardPlatformComponent implements OnChanges {
  @Input() data: any;

  platforms: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.platforms = this.data;
  }

}
