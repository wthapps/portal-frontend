// import { Component, Input } from '@angular/core';
// import { MatChipInputEvent } from '@angular/material';
//
// const COMMA = 188;
// const ENTER = 13;
// declare var _: any;
// /**
//  * This class represents tag component
//  */
// @Component({
//   //   selector: 'h-chip',
//   templateUrl: 'chip.component.html',
//   styleUrls: ['chip.component.css'],
// })
// export class ChipComponent {
//   @Input() tags: Array<any> = new Array<any>();
//
//
//   visible: boolean = true;
//   selectable: boolean = true;
//   removable: boolean = true;
//   addOnBlur: boolean = true;
//
//   // Enter, comma
//   separatorKeysCodes = [ENTER, COMMA];
//
//   add(event: MatChipInputEvent): void {
//     let input = event.input;
//     let value = event.value;
//
//     // Add our tag
//     if ((value || '').trim()) {
//       let index = _.findIndex(this.tags, (tag: any) => {
//         return tag.name == value.trim();
//       });
//       if (index >= 0) return;
//       this.tags.push({ name: value.trim() });
//     }
//     // Reset the input value
//     if (input) {
//       input.value = '';
//     }
//   }
//
//   remove(tag: any): void {
//     let index = this.tags.indexOf(tag);
//
//     if (index >= 0) {
//       this.tags.splice(index, 1);
//     }
//   }
// }
