import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private http: HttpClient) {}

  loginUrl: string = "http://localhost:4000/login";  // ✅ Your backend login endpoint

submitform(data: any) {
  return this.http.post(this.loginUrl, data, {
    withCredentials: true // agar cookies ka use hai
  });
}

}
