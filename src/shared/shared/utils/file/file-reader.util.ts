// import * as Boom from 'boom';

export class FileReaderUtil {
  // Read 1 file
  static read(file: any): Promise<any> {
    if (!file) {
      // return Promise.resolve(Boom.badData("file is empty").output.payload);
      return Promise.resolve('file is empty');

    }
    return new Promise((resolve: any,reject: any) => {
      let fileReader: FileReader = new FileReader();
      fileReader.onloadend = resolve;
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });
  }
  // Read many files
  static readMultiple(fileList: any): Promise<any> {
    if (!fileList || fileList.length < 1) {
      // return Promise.resolve(Boom.badData("list files are bad").output.payload);
      return Promise.resolve('list files are bad');
    }
    let arrPromises: any = [];
    Object.keys(fileList).forEach((key: any, index) => {
      arrPromises.push(this.read(fileList[key]));
    })
    return Promise.all(arrPromises);
  }

  // Return result a file only
  static readDataOnly(file: any) {
    return new Promise((resolve: any, reject: any) => {
      this.read(file).then((res: any) => {
        if (res.error) {
          reject(res);
        }
        resolve({result: res.target.result});
      });
    });
  }
}
