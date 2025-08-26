import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  Total() {
    return this.http.get<any>('http://localhost:4000/api/admin', {
      withCredentials: true,
    });
  }
}
