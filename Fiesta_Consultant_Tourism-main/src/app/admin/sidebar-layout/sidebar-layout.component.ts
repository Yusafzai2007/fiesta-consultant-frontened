// ✅ Fixed logout navigation with correct Angular routing
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css',
})
export class SidebarLayoutComponent implements OnInit {
  isSidebarOpen = false; // Start closed on mobile by default

  adminInfo = {
    name: 'Admin',
    profileImage: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSidebarOpen = window.innerWidth >= 640;
  }

  menuLinks = [
    { icon: 'fa-home', text: 'Dashboard', path: '/admin' },
    { icon: 'fa-brands fa-first-order', text: 'Orders', path: '/admin/Orders' },
    {
      icon: 'fa-money-bill-wave',
      text: 'Add-Products',
      path: '/admin/Add-Products',
    },
    { icon: 'fa-credit-card', text: 'Products', path: '/admin/products' },
    { icon: 'fa-check-circle', text: 'Users', path: '/admin/Users' },
    { icon: 'fa-chart-line', text: 'Analytics', path: '/admin/analytics' }, // optional if exists
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.adminInfo.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  logout() {
    this.http
      .post('http://localhost:4000/api/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          window.location.href = '/login'; // Hard reload (100% works)
        },
        error: (err) => {
          window.location.href = '/login'; // Still redirect
        },
      });
  }
}
