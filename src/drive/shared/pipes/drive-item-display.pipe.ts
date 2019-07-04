import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'driveItemDisplay' })
export class DriveItemDisplayPipe implements PipeTransform {
  transform(value): any {
    return value;
  }
}
