import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/product/category';

@Pipe({
    name: 'productTotalQuantity'
})
export class ProductTotalQuantityPipe implements PipeTransform {

    transform(categories: Category[]): number {
        return categories.reduce((total, category) => total += category.total, 0);
    }
}
