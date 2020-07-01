import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Category } from '../models/product/category';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product/product';
import { EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productList$: BehaviorSubject<any> = new BehaviorSubject<object>({
        kindofProductsLen: 0,
        products: [],
        cursor: ''
    });

    productSearch$: BehaviorSubject<any> = new BehaviorSubject<object>({
        searchAllValue: '',
        searchValue: '',
        categoryId: ''
    });

    categoryIdClicked$: BehaviorSubject<any> = new BehaviorSubject<object>({
        categoryId: 'all',
        categoryName: 'Tất cả'
    });

    constructor(
        private http: HttpClient,
    ) { }

    setCategoryIdClicked(categoryClicked?: object): void {
        this.categoryIdClicked$.next(categoryClicked);
    }

    setProducts(productList) {
        this.productList$.next(productList);
    }

    setProductSearch(productSearch) {
        this.productSearch$.next(productSearch);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
            map(results => results.data)
        );
    }

    getProduct(productId): Observable<Product> {
        return this.http.get<any>(`${environment.apiUrl}/products/${productId}`).pipe(
            map(results => results.data)
        );
    }

    getProducts(params: any): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/products/`, { params }).pipe(
            map(results => {
                return {
                    cursor: results.data.cursor,
                    products: results.data.products,
                    kindofProductsLen: results.data?.total
                };
            })
        );
    }
}
