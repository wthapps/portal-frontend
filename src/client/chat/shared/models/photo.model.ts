import { GenericFile } from '../../../core/shared/models/generic-file.model';
export class Photo extends GenericFile {

  dimensions: string;
  width: number;
  height: number;

  constructor(obj?: any) {
    super(obj);
    this.dimensions    = obj && obj.dimensions    || '0x0';
    this.width         = obj && obj.width         || 0;
    this.height        = obj && obj.height        || 0;

  }
}
