export abstract class BaseModel {
  [key: string]: any;

  init(obj: any) {
    if (obj) {
      for (let key of Object.keys(obj)) {
        this[key] = obj[key];
      }
    }
  }
}
