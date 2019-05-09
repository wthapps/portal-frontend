import DriveFile from '../drive-file.model';
import ItemsList from '@shared/models/items-list.model';
import DriveFolder from '../drive-folder.model';

export default class DriveFileList extends ItemsList {
  static map(array: Array<any>): Array<any> {
    return array.map(element => {
      // if (element.model === 'Common::File') return new DriveFile(element);
      return element.model === 'Common::GenericFile'
        ? new DriveFile(element)
        : new DriveFolder(element);
    });
  }
}
