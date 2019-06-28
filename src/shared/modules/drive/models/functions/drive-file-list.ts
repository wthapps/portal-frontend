import DriveFile from '../drive-file.model';
import ItemsList from '@shared/models/items-list.model';
import DriveFolder from '../drive-folder.model';
import { driveConstants } from 'drive/shared/config/drive-constants';

export interface DriveState {
  folderIds: Array<number>;
  foldersMap: { [id: number]: DriveFolder };
  fileIds: Array<number>;
  filesMap: { [id: number]: DriveFile };
}

export const initDriveState: DriveState = {
  folderIds: [],
  foldersMap: {},
  fileIds: [],
  filesMap: {}
};

export const isFolder = item =>
  item.object_type === driveConstants.OBJECT_TYPE.FOLDER;
export const isFile = item =>
  item.object_type === driveConstants.OBJECT_TYPE.FILE;
export default class DriveFileList extends ItemsList {
  static map(array: Array<any>): Array<any> {
    return array.map(element => {
      return element.model === 'Common::GenericFile'
        ? new DriveFile(element)
        : new DriveFolder(element);
    });
  }

  static parse(data: Array<any>): DriveState {
    const rs = initDriveState;
    data.forEach(item => {
      if (isFolder(item)) {
        rs.folderIds.push(item.id);
        rs.foldersMap[item.id] = item;
      }
      if (isFile(item)) {
        rs.fileIds.push(item.id);
        rs.foldersMap[item.id] = item;
      }
    });

    return rs;
  }
}
