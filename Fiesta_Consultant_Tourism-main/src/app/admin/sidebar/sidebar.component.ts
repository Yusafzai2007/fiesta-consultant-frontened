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
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidebarOpen = false; // Start closed on mobile by default

  ngOnInit(): void {
    this.checkScreenSize();
  }

  adminInfo = {
    name: 'Admin',
    profileImage: '',
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  constructor(private http: HttpClient, private router: Router) {}

  checkScreenSize() {
    if (window.innerWidth < 640) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  menuLinks = [
    { icon: 'fa-home', text: 'Dashboard', path: '/Dashboard' },
    { icon: 'fa-brands fa-first-order', text: 'Orders', path: '/Orders' },
    { icon: 'fa-money-bill-wave', text: 'Add-Products', path: '/Add-Products' },
    { icon: 'fa-credit-card', text: 'products', path: '/products' },
    { icon: 'fa-check-circle', text: 'Users', path: '/Users' },
    { icon: 'fa-chart-line', text: 'Analytics', path: '/analytics' },
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
          // this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed', err);
        },
      });
  }
}
