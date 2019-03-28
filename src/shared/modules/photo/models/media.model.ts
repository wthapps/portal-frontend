import ObjectDataModel from "@shared/common/models/object-data.model";
import { ApiBaseService } from "@shared/services";
import { MediaType } from "./interfaces/media";

export default class Media extends ObjectDataModel implements MediaType {
  id: number;
  uuid: string;
  recipients_count: number;
  favorite: boolean;
  selected: boolean;
  model: string;
  object_type: string;
  apiBaseService = (): ApiBaseService => {
    return ApiBaseService.instance;
  };

  constructor(data: Object = {}) {
    super(data);
  }

  async getApiRecipients() {
    return await Promise.resolve(false);
  }

  async callGetSharing() {
    return await Promise.resolve(false);
  }

  existRecipients() {
    return false;
  }
  existSharing() {
    return false;
  }
}