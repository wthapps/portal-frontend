import { Injectable } from '@angular/core';
import { FileReaderUtil } from '@shared/shared/utils/file/file-reader.util';
import { GenericFileService } from '@shared/services';
import { GenericFile } from '@shared/shared/models/generic-file.model';
import {
  Observer,
  Observable,
  of,
  throwError,
  from } from 'rxjs';
import { map, concatAll, catchError, mergeAll, mergeMap } from 'rxjs/operators';

import * as Boom from 'boom';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { BlackListPolicy } from '@shared/policies/black-list-policy';

// DEPRECATED - Use WUploader instead
@Injectable()
export class FileUploaderService {

  constructor(private genericFileService: GenericFileService) {}

  uploadGenericFile(genFile: any): Observable<any> {
    if (!genFile) {
      return throwError('file is empty');
    }
    return of(genFile).pipe(
      mergeMap(file => FileReaderUtil.read(file), (file, event) => {
        return new GenericFile({
          file: event.target.result,
          name: file.name,
          content_type: file.type,
          parent: file.parent,
          size: file.size
        });
      }),
      mergeMap(genericFile => this.genericFileService.create(genericFile))
    );
  }

  uploadMultipleGenericFiles(files: any): Observable<any> {
    // if (!files || files.length < 1) throw Boom.badData('files are empty');
    if (!files || files.length < 1) { throwError('files are empty'); }
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
      // return _throw(Boom.notAcceptable('file does not accept'));
      return throwError('file does not accept');
    }
  }

  uploadMultipleGenericFilesPolicy(files: any, policies: any = [new BlackListPolicy()]) {
    // if (!files || files.length < 1) throw Boom.badData('files are empty');
    if (!files || files.length < 1) { throwError('files are empty'); }
    const source = from(Object.keys(files).map((key: any) => files[key]));
    const uploadFilesPolicy = source.pipe(
      map((file: any) => this.uploadGenericFilePolicy(file, policies).pipe(catchError(error => of(error.output.payload)))),
      mergeAll()
    );
    return uploadFilesPolicy;
  }
}
