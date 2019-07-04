import ObjectDataModel from "./object-data.model";

export default class User extends ObjectDataModel {
  id: number;
  uuid: string;
  name: string;
  profile_image: string;

  constructor(data: Object = {}) {
    super(data);
  }
}