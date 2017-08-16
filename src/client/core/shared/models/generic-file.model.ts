export class GenericFile {
  id: number;
  uuid: string;
  name: string;
  full_name: string; // include extension
  extension: string;
  content_type: string;
  size: number;
  user: any;
  file: any;
  thumbnail_url: string;
  url: string;
  parent: any;

  created_at: string;
  updated_at: string;

  constructor(obj?: any) {
    this.id            = obj && obj.id             || 0;
    this.uuid          = obj && obj.uuid           || '';
    this.name          = obj && obj.name           || '';
    this.full_name     = obj && obj.full_name      || '';
    this.content_type  = obj && obj.content_type   || 'text';
    this.size          = obj && obj.size           || 0;
    this.user          = obj && obj.user           || null;
    this.file          = obj && obj.file           || null;
    this.thumbnail_url = obj && obj.thumbnail_url  || '#';
    this.url           = obj && obj.url            || '#';
    this.parent        = obj && obj.parent         || null;

  }
}
