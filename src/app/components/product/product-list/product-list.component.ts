import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    searchAllValue: string;
    selectedCategoryId: string;

    @ViewChild('searchInput') searchInput: ElementRef;

    constructor(private productService: ProductService) {
        productService.productList$.subscribe(productList => {
            this.selectedPage = productList.kindofProductsLen === this.kindofProductsLen ? this.selectedPage : 1;
            this.products = productList.products || this.products;
            this.kindofProductsLen = productList.kindofProductsLen;
            this.selectedCategoryId = productList.categoryId || this.selectedCategoryId;
            if (productList.searchAllValue || productList.categoryId) {
                this.searchInput.nativeElement.value = '';
                this.searchAllValue = productList.searchAllValue;
            }
        });
    }

    ngOnInit(): void {
    }

    setSelectedPage(page: number): void {
        if (this.searchInput.nativeElement.value !== '') {
            this.searchProductByName(this.searchInput.nativeElement.value, page);
        } else if (this.searchAllValue) {
            this.productService.searchAll(
                this.searchAllValue,
                page,
                this.limit
            ).subscribe(productList => {
                this.productService.setProducts({
                    kindofProductsLen: productList.kindofProductsLen,
                    products: productList.products,
                    searchAllValue: this.searchAllValue
                });
            });
        } else {
            if (this.selectedCategoryId === 'all') {
                this.productService.getAllProducts(this.selectedPage, this.limit)
                    .subscribe(products =>
                        this.productService.setProducts({
                            kindofProductsLen: this.kindofProductsLen,
                            products
                        })
                    );
            } else {
                const randomProduct: number = Math.floor(Math.random() * this.products.length);
                this.productService.getProductsByCategoryId(this.products[randomProduct].categoryId, this.selectedPage, this.limit)
                    .subscribe(products => this.products = products);
            }
        }
    }

    searchProductByName(productName: string, selectedPage: number) {
        this.productService.searchProductByName(this.selectedCategoryId, productName, selectedPage, this.limit).subscribe(
            productList => {
                this.productService.setProducts({
                    products: productList.products,
                    kindofProductsLen: productList.kindofProductsLen,
                    searchValue: productName,
                    searchAllValue: this.searchAllValue
                });
            }
        );
    }
}
