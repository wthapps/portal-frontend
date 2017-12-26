import { BaseEntity } from './base-entity.model';

export class Context extends BaseEntity {
  
  getContext() {
    return this;
  }

  setContext(context: Object) {
    for(let c in context) {
      this[c] = context[c]
    }
  }
}
