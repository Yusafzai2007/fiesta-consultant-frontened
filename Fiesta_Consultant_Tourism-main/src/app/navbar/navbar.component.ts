import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  email: string = 'fiestaconsultants1@gmail.com';

  menuOpen = false;
  isMenuOpen = false;
  isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkLoginStatus();
    // Listen for login events from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'loginStatus') {
        this.checkLoginStatus();
      }
    });
  }

  checkLoginStatus(): void {
    this.http
      .get('http://localhost:4000/api/verify-token', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.isLoggedIn = true;
          this.updateMenuItems();
        },
        error: () => {
          this.isLoggedIn = false;
          this.updateMenuItems();
        },
      });
  }

  // Call this method after successful login
  handleLoginSuccess() {
    this.isLoggedIn = true;
    this.updateMenuItems();
    localStorage.setItem('loginStatus', 'loggedIn');
    window.location.reload(); // Force full page refresh
  }

  logout() {
    this.http
      .post('http://localhost:4000/api/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.isLoggedIn = false;
          this.updateMenuItems();
          localStorage.setItem('loginStatus', 'loggedOut');
          window.location.href = '/login';
        },
        error: (err) => {
          console.error('Logout failed:', err);
          window.location.href = '/login';
        },
      });
  }

  updateMenuItems(): void {
    this.menuItems = [
      { label: 'Tours', action: () => this.closeMenu(), href: 'citytour' },
      { label: 'About', action: () => this.closeMenu(), href: 'aboutus' },
      this.isLoggedIn
        ? { label: 'Log Out', action: () => this.logout(), href: '' }
        : {
            label: 'Log In',
            action: () => {
              this.closeMenu();
              this.router.navigate(['/login']);
            },
            href: 'login',
          },
      { label: 'Corporate', action: () => this.closeMenu(), href: 'corporate' },
      { label: 'Local Guide', action: () => this.closeMenu(), href: 'local' },
    ];

    this.menuLinks = [
      { name: 'Tours', href: 'citytour' },
      { name: 'About us', href: 'aboutus' },
      { name: 'Corporate', href: 'corporate' },
      this.isLoggedIn
        ? { name: 'Log Out', href: '', action: () => this.logout() }
        : {
            name: 'LogIn',
            href: 'login',
            action: () => {
              this.closeMenu();
              this.router.navigate(['/login']);
            },
          },
      { name: 'Local Guide', href: 'local' },
    ];
  }

  openWhatsApp() {
    window.open('https://wa.me/3019307229', '_blank');
  }
  openWhatsApp1() {
    window.open('https://wa.me/3026062955', '_blank');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleMenu2() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  socialLinks = [
    {
      href: 'https://pk.linkedin.com/company/fiesta-consultants',
      bgColor: 'bg-blue-700',
      iconClass: 'fab fa-linkedin-in',
    },
    {
      href: 'https://www.facebook.com/FiestaConsultants/',
      bgColor: 'bg-blue-500',
      iconClass: 'fab fa-facebook-f',
    },
    {
      href: 'https://x.com/i/flow/login?redirect_after_login=%2Fsearch%3Fq%3D%2523HospitalityConsultant%26src%3Dhashtag_click',
      bgColor: 'bg-blue-400',
      iconClass: 'fab fa-twitter',
    },
    {
      href: 'https://www.youtube.com/results?search_query=fiesta+consultant',
      bgColor: 'bg-red-600',
      iconClass: 'fab fa-youtube',
    },
    {
      href: 'https://wa.me/971545404171',
      bgColor: 'bg-green-500',
      iconClass: 'fab fa-whatsapp',
    },
  ];


  links = [
    { label: 'Balochistan', path: '/city?cityName=Balochistan' },
    { label: 'Islamabad', path: '/city?cityName=Islamabad' },
    { label: 'Lahore', path: '/city?cityName=Lahore' },
    { label: 'Multan', path: '/city?cityName=Multan' },
    { label: 'Karachi', path: '/city?cityName=Karachi' },
    { label: 'Faisalabad', path: '/city?cityName=Faisalabad' },
  ];

  menuItems: any[] = [];
  menuLinks: any[] = [];

  contactInfo = [
    {
      icon: 'fa-solid fa-phone rotate-45 text-xs text-pink-600',
      label: '+971 54 540 4171',
      class:
        'text-pink-700 font-bold text-xs sm:text-sm mt-1 hover:text-indigo-950',
    },
    {
      icon: 'fa-brands fa-whatsapp text-green-700 text-lg',
      label: '+971 54 540 4171',
      class: 'text-pink-700 font-bold text-sm sm:text-sm hover:text-indigo-950',
    },
  ];

  additionalInfo = [
    {
      icon: 'fa-solid fa-envelope text-pink-700',
      label: 'inquiry@dubaitraveltourism.com',
      class: 'text-pink-700 hover:text-indigo-950 font-bold text-sm sm:text-sm',
    },
    {
      icon: 'fa-solid fa-bullseye text-green-600',
      iconCount: 5,
    },
    {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSduKfXoMWOmScspj3hXVYULnzXNvRbWiKV-Q&s',
      class: 'mt- w-28',
    },
  ];
}
