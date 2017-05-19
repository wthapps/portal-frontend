import { Album } from './album.model';

export class AlbumPhoto {
  album: Album;
  photos: Array<any>;

  constructor(fields: {
    album?: Album,
    photos?: Array<any>,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
