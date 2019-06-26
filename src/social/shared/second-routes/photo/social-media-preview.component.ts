import { Component, ViewChild, Input } from '@angular/core';

import { Constants } from '@shared/constant';
import { User } from '@shared/shared/models';
import { ZMediaPreviewComponent } from '@shared/components/w-media-preview/media-preview.component';

@Component({
  selector: 'social-media-preview',
  templateUrl: 'social-media-preview.component.html'
})
export class SocialMediaPreviewComponent {
  @ViewChild(ZMediaPreviewComponent) mediaPreview: ZMediaPreviewComponent;

  readonly tooltip = Constants.tooltip;
  user: User;

  constructor(
  ) {
  }

}
