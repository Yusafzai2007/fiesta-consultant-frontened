// login.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../loginapi/login.service';
import { HttpClient } from '@angular/common/http'; // ✅ ADD
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // ✅ implements OnInit

  constructor(
    private router: Router,
    private LoginService: LoginService,
    private http: HttpClient // ✅ ADD
  ) {}

  // ✅ RUN THIS ON LOAD
  ngOnInit(): void {
    this.http
      .get('http://localhost:4000/api/verify-token', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          if (res.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (res.role === 'user') {
            this.router.navigate(['/main']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {},
      });
  }

  passwordVisible = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  loginform: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  login(data: any): void {
    if (this.loginform.valid) {
      this.LoginService.submitform(data).subscribe({
        next: (res: any) => {
          const returnUrl = localStorage.getItem('returnUrl');
          localStorage.removeItem('returnUrl');

          // ✅ Use hard reload (with window.location.href)
          if (returnUrl) {
            window.location.href = returnUrl;
          } else {
            if (res.role === 'admin') {
              window.location.href = '/admin';
            } else if (res.role === 'user') {
              window.location.href = '/main';
            } else {
              alert('Unknown role');
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['/invalid']);
          } else if (error.status === 500 || error.status === 0) {
            alert('Server down, try again later');
          } else {
            alert('Login failed');
          }
        },
      });
    } else {
      alert('Form sahi se fill karo');
    }
  }
}
