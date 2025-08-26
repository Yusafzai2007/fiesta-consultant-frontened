import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartssService {
  private apiUrl = 'http://localhost:4000/api/admin';

  constructor(private http: HttpClient) {}

  getChartData(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      withCredentials: true, // ✅ Use this if your backend requires cookies (auth)
    });
  }
}
