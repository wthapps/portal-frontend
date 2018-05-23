export class DataUtil {
  static update(objects, object: any) {
    return objects.map(ob => {
      if (this.eq(object, ob)) return object;
      return ob;
    });
  }

  static eq(a: any, b: any, terms: any = ['id', 'uuid']) {
    return terms.some(t => {
      return a[t] && b[t] && a[t] == b[t];
    });
  }
}
