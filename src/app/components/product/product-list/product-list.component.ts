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
    selectedPage = 1;
    limit = 5;
    kindofProductsLen: number;

    constructor(private productService: ProductService) {
        productService.productList$
            .subscribe(productList => {
                this.kindofProductsLen = productList?.kindofProductsLen || this.kindofProductsLen;
                this.products = productList?.products;
                this.selectedPage = productList?.kindofProductsLen ? 1 : this.selectedPage;
            });
    }

    ngOnInit(): void {
    }

    setSelectedPage(selectedPage: number): void {
        this.selectedPage = selectedPage;
        if (document.querySelectorAll('[data-categoryId="all"]')[0].classList.contains('selected')) {
            this.productService.getAllProducts(selectedPage, this.limit)
            .subscribe(products =>
                this.productService.setProducts({
                    products
                })
            );
        } else {
            const randomProduct: number = Math.floor(Math.random() * this.products.length);
            this.productService.getProductsByCategoryId(this.products[randomProduct].categoryId, selectedPage, this.limit)
                .subscribe(products => this.products = products);
        }
    }
}
