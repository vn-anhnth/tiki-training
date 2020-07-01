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

    constructor(private productService: ProductService) {
        productService.productSearch$.subscribe(productSearch => {
            if (productSearch.searchAllValue) {
                this.selectedCategoryId = 'all';
            }
        });
     }

    ngOnInit(): void {
        // this.productService.getCategories().pipe(
        //     tap(categories => this.categories = categories),
        //     switchMap(() => this.productService.getAllProducts(1, this.limit))
        // ).subscribe(products => {
        //     if (this.selectedCategoryId !== 'all') {
        //         this.productService.setProducts({
        //             kindofProductsLen: this.categories.reduce((total, category) => total += category.total, 0),
        //             products
        //         });
        //         this.productService.setProductSearch({});
        //         this.productService.setCategoryIdClicked();
        //         this.selectedCategoryId = 'all';
        //     }
        // });

        this.productService.getCategories().subscribe(categories => {
            this.categories = categories;
            if (this.selectedCategoryId !== 'all') {
                this.getAllProducts();
            }
        });
    }

    getAllProducts(): void {
        const params = { limit: this.limit };
        this.productService.getProducts(params).subscribe(productList => {
            this.productService.setProducts({
                kindofProductsLen: this.categories.reduce((total, category) => total += category.total, 0),
                products: productList.products,
                cursor: productList.cursor
            });
            this.productService.setProductSearch({});
            this.productService.setCategoryIdClicked({
                categoryId: 'all',
                categoryName: 'Tất cả'
            });
            this.selectedCategoryId = 'all';
        });
    }

    getProductsByCategoryId(categoryId: string, categoryName: string): void {
        const params = { categoryId, limit: this.limit };
        this.productService.getProducts(params).subscribe(productList => {
            this.productService.setProducts({
                kindofProductsLen: this.categories.filter(category => category.id === parseInt(this.selectedCategoryId, 10))[0].total,
                products: productList.products,
                cursor: productList.cursor,
                categoryId
            });
            this.productService.setProductSearch({});
        });
        this.productService.setCategoryIdClicked({
            categoryId,
            categoryName
        });
        this.selectedCategoryId = categoryId;
    }
}
