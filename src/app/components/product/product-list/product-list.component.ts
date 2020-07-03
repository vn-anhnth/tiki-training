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
    selectedPageBeforeChange = 1;
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
    rate = 0;

    @ViewChild('searchInput') searchInput: ElementRef;

    constructor(private productService: ProductService) {
        productService.productParams$.subscribe(params => {
            this.rate = params.rate || 0;
            productService.getProducts(params).subscribe(productList => {
                this.products = productList.products;
                this.cursor = productList.cursor;
                this.kindofProductsLen = productList.kindofProductsLen;
            });
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

    changePage(page: number): void {
        let cursor: string = this.cursor;
        if (page < this.selectedPageBeforeChange) {
            cursor += '-reverse';
        }
        this.selectedPageBeforeChange = page;
        this.getProductsByOrder(this.selectedOrder, cursor, this.rate);
    }


    getProductsByOrder(order: string, cursor: string = '', rate: number = 0): void {
        if (this.searchInput.nativeElement.value !== '') {
            this.searchProductByName(this.searchInput.nativeElement.value, cursor, order);
        } else if (this.searchAllValue) {
            const params: any = { search: this.searchAllValue, cursor, limit: this.limit, order, rate };
            this.productService.setProductParams(params);
            this.productService.setProductSearch({
                searchAllValue: this.searchAllValue
            });
        } else {
            const params: any = { cursor, limit: this.limit, order, rate };
            if (this.selectedCategoryId !== 'all') {
                params.categoryId = this.selectedCategoryId;
            }
            this.productService.setProductParams(params);
        }
        this.selectedOrder = order;
    }

    searchProductByName(productName: string, cursor: string, order: string = '') {
        if (productName) {
            const params: any = { categoryId: this.selectedCategoryId, search: productName, cursor, limit: this.limit, order, rate: this.rate };
            this.productService.setProductParams(params);
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

    convertRating = (rate: number): Array<string> => {
        const checkedArr: Array<string> = [];
        for (let index = 0; index < 5; index++) {
            Math.floor(rate) > index ? checkedArr.push('checked') : checkedArr.push('');
        }
        return checkedArr;
    }
}
