import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SingupService } from '../api/singup.service';

@Component({
  selector: 'app-sinup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './sinup.component.html',
  styleUrls: ['./sinup.component.css'],
})
export class SinupComponent {
  constructor(private router: Router, private singupService: SingupService) {}
  errorMessage: string = '';
  passwordVisible = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  signup() {
    if (this.signupForm.valid) {
      const data = this.signupForm.value;

      this.singupService.submitForm(data).subscribe({
        next: (res: any) => {
          // alert(res.message || 'Signup successful!');
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error('Signup Error:', err);
          if (err.status === 409) {
            this.errorMessage = 'Email already exists. Try another one.';
          } else if (err.status === 500) {
            this.errorMessage = 'Server error occurred. Please try later.';
          } else if (err.status === 0) {
            this.errorMessage = 'Server is closed:please try again later';
          } else {
            this.errorMessage = 'Signup failed. Please check your input.';
          }
        },
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
