import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Category } from '../models/product/category';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productList$: BehaviorSubject<any> = new BehaviorSubject<object>({
        kindofProductsLen: 0,
        products: [],
        searchAllValue: '',
        searchValue: '',
        categoryId: ''
    });

    constructor(
        private http: HttpClient,
    ) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<any>(`${environment.apiUrl}/categories`).pipe(
            map(results => results.data)
        );
    }

    getProductsByCategoryId(categoryId: string, page: number, limit: number): Observable<Product[]> {
        return this.http.get<any>(`${environment.apiUrl}/products/?page=${page}&limit=${limit}&categoryId=${categoryId}`).pipe(
            map(results => {
                return results.data;
            })
        );
    }

    getAllProducts(page: number, limit: number): Observable<Product[]> {
        return this.http.get<any>(`${environment.apiUrl}/products/?page=${page}&limit=${limit}`).pipe(
            map(results => results.data)
        );
    }

    setProducts(productList) {
        this.productList$.next(productList);
    }

    getProduct(productId): Observable<Product> {
        return this.http.get<any>(`${environment.apiUrl}/products/${productId}`).pipe(
            map(results => results.data)
        );
    }

    searchProductByName(categoryId: string, productName: string, page: number, limit: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/products?search=${productName}&categoryId=${categoryId}&page=${page}&limit=${limit}`).pipe(
            map(results => {
                return {
                    kindofProductsLen: results.data[0].total,
                    products: results.data.slice(1)
                };
            })
        );
    }

    searchAll(productName: string, page: number, limit: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/products?search=${productName}&page=${page}&limit=${limit}`).pipe(
            map(results => {
                return {
                    kindofProductsLen: results.data[0].total,
                    products: results.data.slice(1)
                };
            })
        );
    }
}
