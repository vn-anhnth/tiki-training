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
    selecteCategoryId: string;
    limit = 5;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.getCategories();
        this.getAllProducts(1, this.limit);
    }

    getAllProducts(page: number, limit: number): void {
        this.productService.getAllProducts(page, limit)
            .subscribe(products =>
                this.productService.setProducts({
                    kindofProductsLen: this.categories.reduce((total, category) => total += category.total, 0),
                    products
                })
            );
        this.selecteCategoryId = '';
    }

    getCategories(): void {
        this.productService.getCategories().subscribe(categories => this.categories = categories);
    }

    getProductsByCategoryId(categoryId: string): void {
        this.productService.getProductsByCategoryId(categoryId, 1, this.limit)
            .subscribe(products =>
                this.productService.setProducts({
                    kindofProductsLen: this.categories.filter(category => category.id === this.selecteCategoryId)[0].total,
                    products
                })
            );
        this.selecteCategoryId = categoryId;
    }
}