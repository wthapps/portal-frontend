import {
  Component,
  Input,
  EventEmitter,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { WUploader } from '@shared/services/w-uploader';

@Component({
  selector: 'w-uploader-input',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WUploaderComponent {

  constructor(private uploader: WUploader) {}

  changeFiles(e: any) {
    // validate acceptable
    const errorFiles: any = [];
    Object.keys(e.target.files).forEach(k => {

    });
    if (this.existErrors) {
      return;
    }

  }
}
