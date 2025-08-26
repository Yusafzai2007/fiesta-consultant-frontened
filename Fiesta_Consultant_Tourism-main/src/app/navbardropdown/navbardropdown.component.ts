import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbardropdown',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbardropdown.component.html',
  styleUrl: './navbardropdown.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbardropdownComponent  {

  defaultSlides = [
    {
    img: '/assets/nature2.jpg',
      alt: 'Rewards Bonanza',
    },
     {
    img: '/assets/nature12.jpg',
      alt: 'Rewards Bonanza',
    },
    {
    img: '/assets/natures11.webp',
      alt: 'Rewards Bonanza',
    },
   
   
    
  
   
  ];

  @Input() slides: { img: string; alt: string }[] = this.defaultSlides;




  features = [
    { icon: 'fas fa-tags text-red-600 rotate-45', text: 'BEST PRICE GUARANTEE', route: '/Product_details' },
    { icon: 'fas fa-comments text-green-600 text-2xl', text: '24X7 LIVE CHAT SUPPORT', route: '/Product_details' },
    { icon: 'fas fa-bookmark text-blue-600 text-2xl', text: 'FAST BOOKING', route: '/Product_details' },
    { icon: 'fas fa-star text-red-600 text-2xl', text: '5 STAR FACILITIES', route: '/Product_details' },
    { icon: 'fas fa-wifi text-blue-600 text-2xl', text: 'WIFI COMING SOON', route: '/Product_details' },
  ];















  
  activeIndex = 0;
  carouselItems = [
    {     image: '/assets/nature2.jpg', alt: 'Slide 1' },
    {     image: '/assets/nature12.jpg', alt: 'Slide 1' },
    {     image: 'https://www.shutterstock.com/image-photo/himalaya-panoramic-view-indian-himalayas-260nw-1841402155.jpg', alt: 'Slide 1' },
 
  ];
  private interval: any;

  constructor() { }

  ngOnInit(): void {
    // this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
  }

  startAutoRotation(): void {
    this.interval = setInterval(() => this.next(), 5000);
  }

  stopAutoRotation(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  next(): void {
    this.activeIndex = (this.activeIndex + 1) % this.carouselItems.length;
  }

  prev(): void {
    this.activeIndex = (this.activeIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
  }

  goTo(index: number): void {
    this.activeIndex = index;
  }
}

