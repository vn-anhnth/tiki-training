import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/product/category';

@Pipe({
    name: 'productTotalQuantity'
})
export class ProductTotalQuantityPipe implements PipeTransform {

    transform(category: Category[], categoryId?: string): number {
        let categoryClone = [...category];
        if (categoryId) {
            categoryClone = category.filter(category => category.id === categoryId);
        }
        return categoryClone.reduce((total, category) => total += category.total, 0);
    }
}
