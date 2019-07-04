import { Pipe, PipeTransform } from '@angular/core';

/**
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize: option
 *   option: {
 *      unit: 'bytes' | 'KB' | 'MB' | 'TB' | 'PB'
 *      precision: number value. Default value is 2
 *      showPrecision: boolean. Default value is false. Don't show precision for integer value.
 *   }
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
 */
@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  transform(bytes: number = 0, option?: any ): string {
    bytes = Number(bytes);
    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) return '?';
    let isInt: boolean;
    let unitIndex = 0;
    let defaultOtion = {
      precision: 2, unit: null, showPrecision: false
    };

    if (option) {
      defaultOtion = {...defaultOtion, ...option};
    }

    const { unit, precision, showPrecision } = defaultOtion;
    while ( bytes >= 1024 ) {
      if (unit && unit === this.units[unitIndex]) {
        break;
      }
      bytes /= 1024;
      unitIndex ++;
    }
    isInt = Number(bytes) === bytes && bytes % 1 === 0;

    return bytes.toFixed( !isInt ? precision : showPrecision ? precision : 0) + ' ' + this.units[ unitIndex ];
  }
}
