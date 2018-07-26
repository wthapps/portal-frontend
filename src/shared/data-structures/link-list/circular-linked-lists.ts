import { Node } from '@shared/data-structures/link-list/node';

export class CircularLinkedLists {
  head: Node;
  current: Node;
  constructor(array: Array<any>) {
    this.head = new Node(array[0]);
    array.shift();
    let tmp: Node = this.head;
    array.forEach(element => {
      tmp.next = new Node(element);
      tmp.next.prev = tmp;
      tmp = tmp.next;
    });
    tmp.next = this.head;
    this.head.prev = tmp;
    this.current = this.head;
  }

  next() {
    this.current = this.current.next;
  }

  prev() {
    this.current = this.current.prev;
  }
}
