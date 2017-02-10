import { BaseHelper } from '../base.helper';
import { ApiBaseService } from '../../services/apibase.service';

export class FileUploadHelper extends BaseHelper {
  apiBaseService: ApiBaseService;
  callback:any;

  upload(files:any, callback:any) {
    this.callback = callback;
    this.processFiles(files);
  }

  processFiles(files:any) {
    for(let i = 0; i< files.length; i++)
    {
      let file = files[i];
      let fileReader = new FileReader();
      // After Load(Read) file
      fileReader.onload = (event:any) => { this.callback(event, file) };
      // Read the image
      fileReader.readAsDataURL(file);
    }
  }
}
