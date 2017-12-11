import { ApiBaseService } from '../../services/apibase.service';

export class FileUploadHelper {
  apiBaseService: ApiBaseService;

  upload(files: any, callback: any) {
    this.processFiles(files, (event: any, file: any) => {
      callback(event, file);
    });
  }

  allowUpload(files: any, callback: any) {
    let filesAllow: any = [];
    let filesNotAllow: any = [];
    this.processFiles(files, (event: any, file: any) => {
      if (this.getExtension(file.name) == 'exe') {
        filesNotAllow.push(file)
      } else {
        filesAllow.push(file)
      }
      if (filesNotAllow.length + filesAllow.length == files.length) {
        callback(filesAllow, filesNotAllow);
      }
    });
  }

  getExtension(fileName: any) {
    return fileName.split('.').pop();
  }

  processFiles(files: any, callback: any) {
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileReader = new FileReader();
      // After Load(Read) file
      fileReader.onload = (event: any) => {
        callback(event, file);
      };
      // Read the image
      fileReader.readAsDataURL(file);
    }
  }
}
