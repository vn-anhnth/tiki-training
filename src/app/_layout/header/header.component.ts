import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    limit = 5;

    @ViewChild('searchAllInput') searchAllInput: ElementRef;

    constructor(private productService: ProductService) {
        productService.productList$.subscribe( productList => {
            if (productList.searchValue || productList.categoryId) {
                this.searchAllInput.nativeElement.value = '';
            }
        });
    }

    ngOnInit(): void {

    }

    searchAll(searchAllInput: string) {
        this.productService.searchAll(searchAllInput, 1, this.limit).subscribe(productList => {
            this.productService.setProducts({
                kindofProductsLen: productList.kindofProductsLen,
                products: productList.products,
                searchAllValue: this.searchAllInput.nativeElement.value
            });
        });
    }
}
