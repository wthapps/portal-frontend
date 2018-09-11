import { Injectable } from "@angular/core";
import { FileReaderUtil } from "@shared/shared/utils/file/file-reader.util";
import { GenericFileService } from "@shared/services";
import { GenericFile } from "@shared/shared/models/generic-file.model";
import { Observer, Observable } from "rxjs";
import * as Boom from "boom";
import { of } from "rxjs/observable/of";
import { map, concatAll, catchError, mergeAll, mergeMap } from "rxjs/operators";
import { FileUploadPolicy } from "@shared/policies/file-upload.policy";
import { _throw } from 'rxjs/observable/throw';
import { from } from 'rxjs/observable/from';
import { BlackListPolicy } from "@shared/policies/black-list-policy";

@Injectable()
export class FileUploaderService {

  constructor(private genericFileService: GenericFileService){}

  uploadGenericFile(file: any) : Observable<any> {
    if (!file) {
      return _throw(Boom.badData('file is empty'));
    }
    return of(file).pipe(
      mergeMap(file => FileReaderUtil.read(file), (file, event) => {
        return new GenericFile({
          file: event.target.result,
          name: file.name,
          content_type: file.type,
          parent: file.parent
        });
      }),
      mergeMap(genericFile => this.genericFileService.create(genericFile))
    );
  }

  uploadMultipleGenericFiles(files: any): Observable<any> {
    if (!files || files.length < 1) throw Boom.badData('files are empty');
    const source = from(Object.keys(files).map((key: any) => files[key]));
    const uploadFiles = source.pipe(
      map((file: any) => this.uploadGenericFile(file)),
      mergeAll()
    );
    return uploadFiles;
  }


  uploadGenericFilePolicy(file: any, policies: any) {
    if (FileUploadPolicy.isAllow(file, policies)) {
      return this.uploadGenericFile(file);
    } else {
      return _throw(Boom.notAcceptable('file does not accept'));
    }
  }

  uploadMultipleGenericFilesPolicy(files: any, policies: any = [new BlackListPolicy()]) {
    if (!files || files.length < 1) throw Boom.badData('files are empty');
    const source = from(Object.keys(files).map((key: any) => files[key]));
    const uploadFilesPolicy = source.pipe(
      map((file: any) => this.uploadGenericFilePolicy(file, policies).pipe(catchError(error => of(error.output.payload)))),
      mergeAll()
    );
    return uploadFilesPolicy;
  }
}
