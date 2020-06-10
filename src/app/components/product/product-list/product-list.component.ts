import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/interfaces/product/category';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {

    categories: Category[];

    constructor(private productCategoriesService: ProductService) { }

    ngOnInit(): void {
        this.getCategories();
    }

    getCategories(): void {
        this.productCategoriesService.getCategories()
            .subscribe(categories => this.categories = categories);
    }

}
