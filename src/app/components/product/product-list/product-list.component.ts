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
    cursor: '';

    @ViewChild('searchInput') searchInput: ElementRef;

    constructor(private productService: ProductService) {
        productService.productList$.subscribe(productList => {
            this.selectedPage = productList.kindofProductsLen === this.kindofProductsLen ? this.selectedPage : 1;
            this.products = productList.products || this.products;
            this.kindofProductsLen = productList.kindofProductsLen;
            this.cursor = productList.cursor;
        });

        productService.categoryIdClicked$.subscribe((categoryIdClicked) => {
            this.selectedOrder = 'position';
            if (categoryIdClicked) {
                this.selectedCategoryId = categoryIdClicked.categoryId;
                this.selectedCagoryName = categoryIdClicked.categoryName;
            } else {
                this.selectedCategoryId = 'all';
                this.selectedCagoryName = 'Tất cả';
            }
        });
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
        this.getProductsByOrder(this.selectedOrder, this.cursor);
    }


    getProductsByOrder(order: string, cursor: string = ''): void {
        if (this.searchInput.nativeElement.value !== '') {
            this.searchProductByName(this.searchInput.nativeElement.value, cursor, order);
        } else if (this.searchAllValue) {
            const params: any = { search: this.searchAllValue, cursor, limit: this.limit, order };
            this.productService.getProducts(params).subscribe(productList => {
                this.productService.setProducts({
                    kindofProductsLen: productList.kindofProductsLen,
                    products: productList.products,
                    cursor: productList.cursor
                });
            });
            this.productService.setProductSearch({
                searchAllValue: this.searchAllValue
            });
        } else {
            const params: any = { cursor, limit: this.limit, order };
            if (this.selectedCategoryId !== 'all') {
                params.categoryId = this.selectedCategoryId;
            }
            this.productService.getProducts(params).subscribe(productList => {
                this.productService.setProducts({
                    kindofProductsLen: this.kindofProductsLen,
                    products: productList.products,
                    cursor: productList.cursor
                });
            });
        }
        this.selectedOrder = order;
    }

    searchProductByName(productName: string, cursor: string, order: string = '') {
        if (productName) {
            const params: any = { categoryId: this.selectedCategoryId, search: productName, cursor, limit: this.limit, order };
            this.productService.getProducts(params).subscribe(productList => {
                this.productService.setProducts({
                    kindofProductsLen: productList.kindofProductsLen,
                    products: productList.products,
                    cursor: productList.cursor
                });
            });
            this.productService.setProductSearch({
                searchValue: productName
            });
            // set selectedOrder='position'
            this.productService.setCategoryIdClicked({
                categoryId: this.selectedCategoryId,
                categoryName: this.selectedCagoryName
            });
        }
    }

    originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return 0;
    }
}
