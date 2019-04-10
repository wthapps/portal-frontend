import { ApiBaseService } from "@shared/services";

export default class ObjectDataModel {
  id: number;
  _metadata: any;
  _options: any;
  apiBaseService = (): ApiBaseService => {
    return ApiBaseService.instance;
  };
  constructor(data = {}, metadata = { saved: false, saveable: true }, options = {}) {
    this.setData(data);
    this._metadata = metadata;
    this._options = options;

    if (this.id) {
      this.setMetadata({ saved: true });
    } else {
      this.setMetadata({ saved: false });
    }
  }

  setData(data) {
    Object.keys(data).forEach(e => {
      this[e] = data[e];
    });
  }

  setMetadata(metadata) {
    this._metadata = Object.assign(this._metadata, metadata);
  }
}