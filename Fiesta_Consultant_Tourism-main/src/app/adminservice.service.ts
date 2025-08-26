import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminserviceService {
  private url: string = 'http://localhost:4000/api/productdetail';

  constructor(private http: HttpClient) {}

  postProduct(data: Product): Observable<any> {
    return this.http.post(this.url, data);
  }
}

export interface Product {
  producttitle: String;
  productdescription: String;
  thumbnail: String[]; // Change from `string` to `string[]`
  tourService: String;
  duration: String;
  transportService: String;
  pickUp: String;
  translatelanguage: String;
  wifi: String;
  adultBaseprice: Number;
  kidsBaseprice: Number;
  quantity: Number;
  price: Number;
  prime: Number;
  nonprime: Number;
  discountPercentage: Number;
  discountedTotal: Number;
  privatetransferprice: Number;
  privatetransferperson: Number;
  cityName: String;
  citydescription: String;
  cityImage: String;
  categorie: String;
}
