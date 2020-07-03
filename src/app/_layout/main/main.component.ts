import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/product/category';
import { Product } from 'src/app/models/product/product';
import { ProductService } from 'src/app/services/product.service';
import { tap, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    categories: Category[] = [];
    selectedCategoryId: string;
    limit = 5;
    productParams: object = {};

    constructor(private productService: ProductService) {
        productService.productSearch$.subscribe(productSearch => {
            if (productSearch.searchAllValue) {
                this.selectedCategoryId = 'all';
            }
        });
        productService.productParams$.subscribe(params => this.productParams = params);
    }

    ngOnInit(): void {
        this.productService.getCategories().subscribe(categories => {
            this.categories = categories;
            if (this.selectedCategoryId !== 'all') {
                this.getAllProducts();
            }
        });
    }

    getAllProducts(): void {
        const params = { limit: this.limit };
        this.productService.setProductParams(params);
        this.productService.setProductSearch({});
        this.productService.setCategoryIdClicked({
            categoryId: 'all',
            categoryName: 'Tất cả'
        });
        this.selectedCategoryId = 'all';
    }

    getProductsByCategoryId(categoryId: string, categoryName: string): void {
        const params = { categoryId, limit: this.limit };
        this.productService.setProductParams(params);
        this.productService.setProductSearch({});
        this.productService.setCategoryIdClicked({
            categoryId,
            categoryName
        });
        this.selectedCategoryId = categoryId;
    }

    getProductsByRating(rate: number): void {
        const params: any = { ...this.productParams };
        delete params.order;
        params.rate = rate;
        this.productService.setProductParams(params);
        // set selectedOrder='position'
        this.productService.setCategoryIdClicked();
    }
}
