import { Node } from '@shared/data-structures/link-list/node';
import { Object } from './basic-object';

export class DoublyLinkedListsV2 {
  head: Node;
  current: Node;
  data: Array<Object>;
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
      this.current = this.current.next;
    }
  }

  prev() {
    if (this.isPrev()) {
      this.current = this.current.prev;
    }
  }

  add(node: Node) {
    const tmp = this.current;
    while (this.isNext()) {
      this.current = this.current.next;
    }
    this.current.next = node;
    this.current = tmp;
  }

  setCurrent(object: Object) {
    while (this.current.data.uuid !== object.uuid && this.current.next) {
      this.current = this.current.next;
    }
    if (this.current.data.uuid !== object.uuid && !this.current.next) {
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
