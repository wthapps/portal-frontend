import { Pipe, PipeTransform } from '@angular/core';
import { isNumberFinite, isPositive, isInteger, toDecimal } from '../utils/utils';

export type ByteUnit = 'Byte' | 'KB' | 'MB' | 'GB' | 'TB';


@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {

  static formats: { [key: string]: { max: number, prev?: ByteUnit }} = {
    'Byte': {max: 1024},
    'KB': {max: Math.pow(1024, 2), prev: 'Byte'},
    'MB': {max: Math.pow(1024, 3), prev: 'KB'},
    'GB': {max: Math.pow(1024, 4), prev: 'MB'},
    'TB': {max: Number.MAX_SAFE_INTEGER, prev: 'GB'}
  };


  transform(input_x: any, decimal: number = 0, from: ByteUnit = 'Byte'): any {
    let input:number = parseInt(input_x);


    if (!(isNumberFinite(input) &&
      isNumberFinite(decimal) &&
      isInteger(decimal) &&
      isPositive(decimal))) {
      return input;
    }

    let bytes = input;
    let unit = from;
    while (unit != 'Byte') {
      bytes *= 1024;
      unit = BytesPipe.formats[unit].prev;
    }

    for (const key in BytesPipe.formats) {
      const format = BytesPipe.formats[key];
      if (bytes < format.max) {

        const prev = BytesPipe.formats[format.prev];

        const result = prev ?
          toDecimal(bytes / prev.max, decimal) :
          toDecimal(bytes, decimal);

        return (result > 1 && key == 'Byte') ? `${result} Bytes` : `${result} ${key}`;
      }
    }
  }
}
