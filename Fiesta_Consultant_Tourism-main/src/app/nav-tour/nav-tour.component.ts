import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceNameService } from '../service-name.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CitydetailsComponent } from "../citydetails/citydetails.component";
@Component({
  selector: 'app-nav-tour',
  imports: [CommonModule, RouterLink, FormsModule, NgxSkeletonLoaderModule, CitydetailsComponent],
  templateUrl: './nav-tour.component.html',
  styleUrl: './nav-tour.component.css',
})
export class NavTourComponent {
  deplist: any[] = [];
  displayedProducts: any[] = [];
  uniqueCities: string[] = [];
  selectedCities: string[] = [];
  skeletonArray: number[] = [];
  isloader: boolean = false;
  constructor(private depsrv: ServiceNameService) {}

  ngOnInit(): void {
    this.generateSkeletons(8); // or any default expected count

    this.fetchDepartmentData();
  }
  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }
  fetchDepartmentData() {
    this.isloader = true;
    this.generateSkeletons(8);
    this.depsrv.getproductDepartment().subscribe(
      (res: any) => {
        this.deplist = res.products.map((item: any) => ({
          id: item._id,
          title: item.producttitle,
          // Corrected image path, including the backend URL
          image:
            item.thumbnail && item.thumbnail[0]
              ? `http://localhost:4000/uploads/${item.thumbnail[1]}` // Backend image path
              : '/assets/fallback-image-url.jpg', // Fallback image
          price: item.price,
          producttitle: item.producttitle,
          cityName: item.cityName,
          duration: item.duration,
          productdescription: item.productdescription,
          discountend: item.discountend,
          discountPercentage: item.discountPercentage,
          adultBaseprice: item.adultBaseprice,
        }));
        this.isloader = false;

        this.extractUniqueCities();
        this.updateDisplayedProducts();
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  extractUniqueCities() {
    const cities = this.deplist.map((item) => item.cityName);
    this.uniqueCities = Array.from(new Set(cities)); // Get unique city names
  }

  updateDisplayedProducts() {
    if (this.selectedCities.length > 0) {
      this.displayedProducts = this.deplist.filter((product) =>
        this.selectedCities.includes(product.cityName)
      );
    } else {
      this.displayedProducts = [...this.deplist]; // Display all products
    }
  }

  onCityFilterChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.selectedCities.push(value);
    } else {
      this.selectedCities = this.selectedCities.filter(
        (city) => city !== value
      );
    }
    this.updateDisplayedProducts();
  }

  countProductsByCity(cityName: string): number {
    return this.deplist.filter((product) => product.cityName === cityName)
      .length;
  }

  icons = [
    {
      icon: 'fas fa-pencil-alt',
      text: 'Description',
      bgColor: 'bg-red-500',
    },
    {
      icon: 'fas fa-plus',
      text: 'Inclusion',
      bgColor: 'bg-yellow-500',
    },
    {
      icon: 'fas fa-clock',
      text: 'Timings',
      bgColor: 'bg-blue-500',
    },
    {
      icon: 'fas fa-info',
      text: 'Useful Info',
      bgColor: 'bg-orange-500',
    },
  ];

  checkbox: boolean = true;

  toggleCheckbox(): void {
    this.checkbox = !this.checkbox;
  }
  checkbox2: boolean = true;

  toggleCheckbox2(): void {
    this.checkbox2 = !this.checkbox2;
  }
}
