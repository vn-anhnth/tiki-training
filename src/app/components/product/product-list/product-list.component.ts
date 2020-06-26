import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product/product';
import { KeyValue } from '@angular/common';


@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements AfterViewInit {

    products: Product[] = [];
    selectedPage = 1;
    limit = 5;
    kindofProductsLen: number;
    searchAllValue: string;
    selectedCategoryId = 'all';
    selectedCagoryName = 'Tất cả';
    selectedOrder = 'position';
    orderList = {
        newest: 'HÀNG MỚI',
        top_seller: 'BÁN CHẠY',
        discount_desc: 'GIẢM GIÁ NHIỀU',
        price_asc: 'GIÁ THẤP',
        price_desc: 'GIÁ CAO',
        position: 'CHỌN LỌC'
    };

    @ViewChild('searchInput') searchInput: ElementRef;

    constructor(private productService: ProductService) {
        productService.productList$.subscribe(productList => {
            this.selectedPage = productList.kindofProductsLen === this.kindofProductsLen ? this.selectedPage : 1;
            this.products = productList.products || this.products;
            this.kindofProductsLen = productList.kindofProductsLen;
        });

        this.productService.productSearch$.subscribe(productSearch => {
            if (productSearch.searchAllValue || (!productSearch.searchValue && !productSearch.searchAllValue)) {
                const seletedCategoryEle = document.querySelectorAll('a[data-categoryId].selected')[0];
                if (seletedCategoryEle) {
                    this.selectedCategoryId = seletedCategoryEle.getAttribute('data-categoryId');
                    this.selectedCagoryName = seletedCategoryEle.textContent.split('(')[0];
                }
            }
        });

        productService.categoryIdClicked$.subscribe(() => this.selectedOrder = 'position');
    }

    ngAfterViewInit(): void {
        this.productService.productSearch$.subscribe(productSearch => {
            if (productSearch.searchAllValue || (!productSearch.searchValue && !productSearch.searchAllValue)) {
                this.searchInput.nativeElement.value = '';
                this.searchAllValue = productSearch.searchAllValue;
            }
        });
    }

    setSelectedPage(page: number): void {
        this.getProductsByOrder(this.selectedOrder, page);
    }


    getProductsByOrder(order: string, page: number = 1): void {
        if (this.searchInput.nativeElement.value !== '') {
            this.searchProductByName(this.searchInput.nativeElement.value, page, order);
        } else if (this.searchAllValue) {
            this.productService.searchAll(this.searchAllValue, page, this.limit, order).subscribe(productList => {
                this.productService.setProducts({
                    kindofProductsLen: productList.kindofProductsLen,
                    products: productList.products
                });
                this.productService.setProductSearch({
                    searchAllValue: this.searchAllValue
                });
            });
        } else {
            if (this.selectedCategoryId === 'all') {
                this.productService.getAllProducts(page, this.limit, order).subscribe(products => {
                    this.productService.setProducts({
                        kindofProductsLen: this.kindofProductsLen,
                        products
                    });
                });
            } else {
                this.productService.getProductsByCategoryId(this.selectedCategoryId, page, this.limit, order).subscribe(products => {
                    this.productService.setProducts({
                        kindofProductsLen: this.kindofProductsLen,
                        products
                    });
                });
            }
        }
        this.selectedOrder = order;
    }

    searchProductByName(productName: string, selectedPage: number, order: string = '') {
        if (productName) {
            this.productService.searchProductByName(this.selectedCategoryId, productName, selectedPage, this.limit, order)
                .subscribe(productList => {
                    this.productService.setProducts({
                        products: productList.products,
                        kindofProductsLen: productList.kindofProductsLen
                    });
                    this.productService.setProductSearch({
                        searchValue: productName
                    });
                });
            this.productService.setCategoryIdClicked();
        }
    }

    originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return 0;
    }
}
