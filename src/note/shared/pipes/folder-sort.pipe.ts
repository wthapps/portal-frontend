import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'folderSort' })
export class FolderSortPipe implements PipeTransform {
  transform(folders: any[], field = 'name'): any {
    folders.sort((a, b) => this.sortFn(a, b, field));

    this.recursiveSort(folders, field);
    return folders;
  }

  private recursiveSort(folders, field) {
    folders.forEach(f => {
      if (f.items && f.items.length > 0) {
        f.items.sort((a, b) => this.sortFn(a, b, field));
        this.recursiveSort(f.items, field);
      }
    });
  }

  private sortFn(a, b, field) {
    const nameA = a[field].toUpperCase(); // ignore upper and lowercase
    const nameB = b[field].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
}
