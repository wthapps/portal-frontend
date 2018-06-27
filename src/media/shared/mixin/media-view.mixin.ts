/* MediaViewMixin This is media view methods, to
custom method please overwirte any method*/
export class MediaViewMixin {
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;

  changeViewMode(mode: any) {
    this.viewMode = mode;
  }
}
