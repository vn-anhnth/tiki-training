import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Category } from '../models/product/category';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    products$ = new Subject<Product[]>();
    realProductsLen$ = new Subject<number>();

    constructor(
        private http: HttpClient,
    ) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
    }

    getProductsByCategoryId(option?: any): Observable<Product[]> {
        return this.http.get<Product[]>(`${environment.apiUrl}/products`).pipe(
            map(products => {
                products = products.filter(product => product.categoryId === option.categoryId);
                this.realProductsLen$.next(products.length);
                products = products.slice(
                    (option.selectedPage - 1) * option.limit,
                    option.selectedPage * option.limit
                );
                this.products$.next(products);
                return products;
            })
        );
    }

    getAllProducts(firstTime?: boolean, option?: any): Observable<Product[]> {
        if (firstTime) {
            return this.http.get<Product[]>(`${environment.apiUrl}/products`).pipe(
                map(products => {
                    localStorage.setItem('realProductsAllLen', products.length.toString());
                    this.realProductsLen$.next(products.length);
                    this.products$.next(products.slice(0, 5));
                    return products;
                })
            );
        } else {
            return this.http.get<Product[]>(`${environment.apiUrl}/products/?page=${option.page}&limit=${option.limit}`).pipe(
                map(products => {
                    this.products$.next(products);
                    const realProductsAllLen: number = +localStorage.getItem('realProductsAllLen');
                    this.realProductsLen$.next(realProductsAllLen);
                    return products;
                })
            );
        }

    }

    getProduct(productId): Observable<Product> {
        return this.http.get<Product>(`${environment.apiUrl}/products/${productId}`);
    }
}
