import { Injectable } from "@angular/core";
import { FileReaderUtil } from "@shared/shared/utils/file/file-reader.util";
import { GenericFileService } from "@shared/services";
import { GenericFile } from "@shared/shared/models/generic-file.model";
import { Observer, Observable } from "rxjs";

@Injectable()
export class FileUploaderService {

  constructor(private genericFileService: GenericFileService){}

  uploadGenericFile(file: any) : Observable<any> {
    return new Observable((observer: any) => {
      FileReaderUtil.read(file).then((event: any) => {
        let genericFile = new GenericFile({
          file: event.target.result,
          name: file.name,
          content_type: file.type,
          parent: file.parent
        });
        this.genericFileService.create(genericFile).take(1).subscribe((res: any) => {
          observer.next(res);
        })
      });
    })
  }

  uploadMultiple(files: any) {

  }
}
