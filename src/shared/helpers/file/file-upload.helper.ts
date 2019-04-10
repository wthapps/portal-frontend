
export class FileUploadHelper {

  static upload(files: any) {
    let data = new FormData();
    let request = new XMLHttpRequest();
    data.append('file', files[0]);

    // AJAX request finished
    request.addEventListener('load', function (e) {
      // request.response will hold the response from the server
      console.log(request.response);
    });

    // Upload progress on request.upload
    request.upload.addEventListener('progress', function (e) {
      var percent_complete = (e.loaded / e.total) * 100;

      // Percentage of upload completed
      console.log(percent_complete);
    });

    // If server is sending a JSON response then set JSON response type
    request.responseType = 'json';

    // Send POST request to the server side script
    request.open('post', 'http://localhost:4000/test/tests');
    request.withCredentials = true
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("ACCEPT", "application/json");
    request.send(data);

    // this.processFiles(files, (event: any, file: any) => {
    //   callback(event, file);
    // });
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
