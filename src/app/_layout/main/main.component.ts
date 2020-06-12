import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/product/category';
import { Product } from 'src/app/models/product/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    categories: Category[] = [];
    products: Product[] = [];
    selecteCategoryId: string;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.getCategories();
        this.getAllProducts(true);
    }

    getAllProducts(firstTime?: boolean, option?: any): void {
        this.productService.getAllProducts(firstTime, option)
            .subscribe(products => {
                if (firstTime) {
                    this.products = products;
                }
            });
        this.selecteCategoryId = '';
    }

    getCategories(): void {
        this.productService.getCategories()
            .subscribe(categories => this.categories = categories);
    }

    getProductsByCategoryId(categoryId: string): void {
        this.productService.getProductsByCategoryId({ categoryId, selectedPage: 1, limit: 5 }).subscribe();
        this.selecteCategoryId = categoryId;
    }
}
