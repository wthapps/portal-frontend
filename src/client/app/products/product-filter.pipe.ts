import {PipeTransform, Pipe} from '@angular/core';
import {IProduct} from './products';

@Pipe({
    name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {
    /*transform(value:IProduct[], args:string[]):IProduct[] {
     console.log(args);
     let filter:string = args[0] ? args[0].toLocaleLowerCase() : null;
     return filter ? value.filter((product:IProduct)=>product.productName.toLocaleLowerCase().indexOf(filter) != -1) : value;
     }*/
    transform(value:IProduct[], filter:string):IProduct[] {
        filter = filter ? filter.toLocaleLowerCase() : null;
        return filter ? value.filter((product:IProduct) =>
        product.productName.toLocaleLowerCase().indexOf(filter) !== -1) : value;
    }
}
