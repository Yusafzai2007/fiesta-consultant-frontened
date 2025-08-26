import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  usersData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userdata();
  }

  userdata() {
    this.http.get<any>('http://localhost:4000/api/admin', {
      withCredentials: true // ✅ Cookies (like auth token) ko bhej raha hai
    }).subscribe({
      next: (res) => {
        this.usersData = res.users;
        console.log("✅ Users:", this.usersData);
      },
      error: (err) => {
        console.error("❌ Error:", err);
      }
    });
  }
}
