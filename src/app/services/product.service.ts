import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Category } from '../interfaces/product/category';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient,
    ) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
    }

    // getProductsByCategoryId(categoryId: string): Observable<Product[]> {
    //     this.http.get<Product[]>(`${environment.apiUrl}/products`).pipe(
    //         map(products => {
    //             return of<Product[]>(products.filter(product => product.categoryId === categoryId));
    //         })
    //     );
    // }
}
