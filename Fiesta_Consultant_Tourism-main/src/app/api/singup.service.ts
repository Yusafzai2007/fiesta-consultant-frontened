import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SingupService {
  constructor(private http: HttpClient) {}

  private SingupUrl: string = 'http://localhost:4000/signup'; // 👈 Backend URL

  // ✅ Observable return karo
  submitForm(data: any): Observable<any> {
    console.log("Sending data to backend:", data); // Debug
    return this.http.post(this.SingupUrl, data);
  }
}
