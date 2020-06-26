import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

    limit = 5;

    @ViewChild('searchAllInput') searchAllInput: ElementRef;

    constructor(private productService: ProductService, private router: Router) {
    }

    ngAfterViewInit(): void {
        this.productService.productSearch$.subscribe( productSearch => {
            if (productSearch.searchValue || (!productSearch.searchValue && !productSearch.searchAllValue)) {
                this.searchAllInput.nativeElement.value = '';
            }
        });
    }

    searchAll(searchAllInput: string) {
        if (searchAllInput) {
            this.router.navigateByUrl('');
            this.productService.searchAll(searchAllInput, 1, this.limit).subscribe(productList => {
                this.productService.setProducts({
                    kindofProductsLen: productList.kindofProductsLen,
                    products: productList.products,
                });
                this.productService.setProductSearch({
                    searchAllValue: this.searchAllInput.nativeElement.value,
                });
            });
            this.productService.setCategoryIdClicked();
        }
    }
}
