import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddProductService {
  private url = 'http://localhost:4000/api/productdetail';

  constructor(private http: HttpClient) {}

  postProduct(payload: FormData): Observable<any> {
    return this.http.post(this.url, payload, {
      withCredentials: true,
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`http://localhost:4000/api/singleproduct?id=${id}`, {
      withCredentials: true,
    });
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:4000/api/deleteproduct/${productId}`,
      {
        withCredentials: true,
      }
    );
  }

  deleteProductorder(orderId: string, productId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:4000/api/deleteOrderProduct/${orderId}/${productId}`,
      {
        withCredentials: true,
      }
    );
  }

  updateOrderProduct(
    orderId: string,
    productId: string,
    updatedData: any
  ): Observable<any> {
    return this.http.patch(
      `http://localhost:4000/api/updateOrderProduct/${orderId}/${productId}`,
      updatedData,
      { withCredentials: true }
    );
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.post(
      `http://localhost:4000/api/productupdate?_id=${id}`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
}
