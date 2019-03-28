import Album from "../album.model";
import ItemsList from "@shared/common/models/items-list.model";
import Media from "../media.model";
import { MediaType } from "../interfaces/media";
import Sharing from "../sharing.model";

export default class MediaList extends ItemsList {
  static map(array: Array<any>): Array<any> {
    return array.map(element => {
      if (element.model === 'Media::Album') return new Album(element);
      if (element.model === 'Media::Video' || element.model === 'Media::Photo') return new Media(element);
      if (element.model === 'Common::Sharing') return new Sharing(element);
      return element;
    });
  }

  static existRecipients(array: Array<MediaType>) {
    return (array.length === 1 && array[0].existRecipients());
  }

  static isSingleAlbum(array: Array<any>) {
    return (array.length === 1 && (array[0].model === 'Media::Album' || array[0].object_type === 'Media::Album'));
  }
  static isSingleSharing(array: Array<any>) {
    return (array.length === 1 && (array[0].model === 'Common::Sharing' || array[0].object_type === 'Common::Sharing'));
  }
}


