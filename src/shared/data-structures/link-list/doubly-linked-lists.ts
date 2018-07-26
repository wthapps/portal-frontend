import { Node } from '@shared/data-structures/link-list/node';

export class DoublyLinkedLists {
  head: Node;
  current: Node;
  data: any;
  constructor(array: Array<any>) {
    this.data = [...array];
    this.head = new Node(array[0]);
    array.shift();
    let tmp: Node = this.head;
    array.forEach(element => {
      tmp.next = new Node(element);
      tmp.next.prev = tmp;
      tmp = tmp.next;
    });
    this.current = this.head;
  }
  next() {
    if (this.isNext()) {
      // console.log(this.current.next);
      this.current = this.current.next;
    }
  }

  prev() {
    if (this.isPrev()) {
      // console.log(this.current.prev);
      this.current = this.current.prev;
    }
  }

  setCurrent(id: any) {
    while (this.current.data !== id && this.current.next) {
      this.current = this.current.next;
    }
    if (this.current.data !== id && !this.current.next) {
      this.current = this.head;
    }
  }

  isNext() {
    if (this.current.next) return true;
    return false;
  }

  isPrev() {
    if (this.current.prev) return true;
    return false;
  }
}
