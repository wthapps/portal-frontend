
// export type Actions =
//   MixedEntityAction.getAll |
//   getAllSuccess;

export class MixedEntityAction {
  static GET_ALL = '[MixedEntity] GET_ALL';
  static getAll(payload?: any) {
    return {
      type: this.GET_ALL,
      payload: payload
    }
  }
  static GET_ALL_SUCCESS  = '[MixedEntity] GET_ALL_SUCCESS';
  static getAllSuccess(payload: any) {
    console.log('Calling GET_ALL SUCCESS:::');
    return {
      type: this.GET_ALL_SUCCESS,
      payload: payload
    }
  }

}


