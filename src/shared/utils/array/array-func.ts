export default class ArrayFunc {
  // [1, 2, 3, 4] [1, 2] => [1, 2]
  static filterArray(arr1, arr2, func) {
    return arr1.filter((a1) => {
      return arr2.some(a2 => {
        return func(a1, a2);
      });
    })
  }
  // [1, 2, 3, 4] [1, 2] => [3, 4]
  static removeArray(arr1, arr2, func) {
    return arr1.filter((a1) => {
      return arr2.every(a2 => {
        return !func(a1, a2);
      });
    })
  }
}