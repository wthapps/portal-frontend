declare var Quill: any;

let BlockEmbed = Quill.import('blots/block/embed');

class IconBlot extends BlockEmbed {
  static create(value: any) {
    let node = super.create();
    node.setAttribute('class', value.class);
    node.setAttribute('id', value.id);
    return node;
  }

  static value(node: any) {
    return {
      class: node.getAttribute('class'),
      id: node.getAttribute('id')
    };
  }
}

IconBlot.blotName = 'i';
IconBlot.tagName = 'i';

export default IconBlot;
