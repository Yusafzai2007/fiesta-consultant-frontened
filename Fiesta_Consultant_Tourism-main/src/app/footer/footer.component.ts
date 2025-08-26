import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  links = [
    { name: 'MICE', url: '#' },
    { name: 'Privacy Policy', url: '#' },
    { name: 'Cookie Policy', url: '#' },
    { name: 'Terms and Conditions', url: '#' },
  ];
             src='/assets/image.png'
  logos = [
    {
     src:'/assets/paytab.png',
      alt: 'PayTab',
    },
    {
     src:'/assets/security.png',
      alt: 'Security',
    },
    {
     src:'/assets/payments.png',
      alt: 'Payments',
    },
    {
     src:'/assets/godaddy.png',
      alt: 'GoDaddy',
    },
  ];

  socialLinks = [
    {
      url: 'https://www.facebook.com/checkpoint/1501092823525282/?next=https%3A%2F%2Fwww.facebook.com%2Fdtttourism',
      icon: 'fab fa-facebook fa-2x',
      color: 'text-blue-600',
    },
    {
      url: 'https://www.google.com/search?channel=iphone_bm&q=Premium+Desert+Safari&ludocid=16926568674515931041&gsas=1&client=safari&lsig=AB86z5VjoThlQDx2uWXxduutS-zJ&kgs=8d4e25a522222617&shndl=-1&source=sh/x/kp/local/3&entrypoint=sh/x/kp/local',
      icon: 'fab fa-google fa-2x',
      color: 'text-red-600',
    },
    {
      url: 'https://www.linkedin.com/company/dubai-travel-tourism/',
      icon: 'fab fa-linkedin fa-2x',
      color: 'text-blue-500',
    },
    {
      url: 'https://www.instagram.com/dubaitraveltourism/',
      icon: 'fab fa-instagram fa-2x',
      color: 'text-pink-600',
    },
    {
      url: 'https://www.pinterest.com/Dubaitraveltourism/',
      icon: 'fab fa-pinterest fa-2x',
      color: 'text-red-600',
    },
    {
      url: 'skype:dubaitraveltourism?call',
      icon: 'fab fa-skype fa-2x',
      color: 'text-blue-400',
    },
  ];
}
