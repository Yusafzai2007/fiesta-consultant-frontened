import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './adminservice.service';

export interface ProductResponse {
  product?: Product;
  products?: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ServiceNameService {
  private formDataSubject = new BehaviorSubject<any>(null);
  private productDataSubject = new BehaviorSubject<any>(null);
  private cartDataSubject = new BehaviorSubject<any>(null);

  formData$ = this.formDataSubject.asObservable();
  productData$ = this.productDataSubject.asObservable();
  cartData$ = this.cartDataSubject.asObservable();

  constructor(private http: HttpClient) { }

  getproductDepartment(id?: string): Observable<ProductResponse> {
    if (id) {
      return this.http.get<ProductResponse>(`http://localhost:4000/api/product?id=${id}`);
    } else {
      return this.http.get<ProductResponse>(`http://localhost:4000/api/home`);
    }
  }

  getproductDepartment2() {
    return this.http.get("https://api.escuelajs.co/api/v1/products");
  }

  setFormData(data: any) {
    this.formDataSubject.next(data);
  }

  getFormData() {
    return this.formDataSubject.value;
  }

  setProductData(data: any) {
    this.productDataSubject.next(data);
  }

  getProductData() {
    return this.productDataSubject.value;
  }

  setCartData(data: any) {
    this.cartDataSubject.next(data);
  }

  getCartData() {
    return this.cartDataSubject.value;
  }

  private savedProducts: any[] = [];
  private savedCount: number = 8;

  setProducts(products: any[]) {
    this.savedProducts = products;
  }

  getProducts() {
    return this.savedProducts;
  }

  setCount(count: number) {
    this.savedCount = count;
  }

  getCount() {
    return this.savedCount;
  }
}