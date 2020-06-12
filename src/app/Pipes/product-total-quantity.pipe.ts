import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product/product';

@Pipe({
    name: 'productTotalQuantity'
})
export class ProductTotalQuantityPipe implements PipeTransform {

    transform(products: Product[], categoryId?: string): number {
        let productsClone = [...products];
        if (categoryId) {
            productsClone = products.filter(product => product.categoryId === categoryId);
        }
        return productsClone.reduce((total, product) => total += product.quantity, 0);
    }

}
