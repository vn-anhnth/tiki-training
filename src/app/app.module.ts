import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './_layout/header/header.component';
import { FooterComponent } from './_layout/footer/footer.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';
import { LayoutComponent } from './_layout/layout/layout.component';
import { ProductTotalQuantityPipe } from './Pipes/product-total-quantity.pipe';
import { PaginationPipe } from './Pipes/pagination.pipe';
import { MainComponent } from './_layout/main/main.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ProductListComponent,
        ProductDetailComponent,
        LayoutComponent,
        ProductTotalQuantityPipe,
        PaginationPipe,
        MainComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
