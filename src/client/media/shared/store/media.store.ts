import { Injectable } from '@angular/core';

declare var _: any;

@Injectable()
export class ZMediaStore {

  private selectedObjects: any[] = [];
  private currentSelectedObject: any;

  public selectObjects(objects: any[]) {

    this.clearSelected();
    this.selectedObjects.push(...objects);
  }

  public setCurrentSelectedObject(object: any) {
    this.currentSelectedObject = object;
  }

  public getCurrentSelectedObject() {
    return this.currentSelectedObject;
  }

  public getSelectedObjects(): any[] {
    return this.selectedObjects;
  }

  public getCurrentSelectedIndex() {
    return _.findIndex(this.selectedObjects, (o: any) => o.uuid == this.currentSelectedObject.uuid);
  }

  public clearSelected() {
    this.selectedObjects.length = 0;
  }
}
