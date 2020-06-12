import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/product/category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product/product';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {

    products: Product[] = [];
    realProductsLen: number;
    selectedPage: number = 1;

    constructor(private productService: ProductService) {
        productService.products$.subscribe(products => this.products = products);
        productService.realProductsLen$.subscribe(realProductsLen => this.realProductsLen = realProductsLen);
    }

    ngOnInit(): void {
    }

    setSelectedPage(selectedPage: number): void {
        this.selectedPage = selectedPage;
        const randomProduct: number = Math.floor(Math.random() * this.products.length);
        this.productService.getProductsByCategoryId({ categoryId: this.products[randomProduct].categoryId, selectedPage, limit: 5 })
            .subscribe();
    }
}
