export interface Product {
    id: number;
    productName: string;
    img: Array<{}>;
    categoryId: number;
    categoryName?: number;
    quantity: number;
    price: number;
    discount: number;
    description: string;
}
