import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// First define the Timings interface
interface Timings {
  duration?: string;
  tourService?: string;
  pickupTime?: string;
  wifi?: string;
}

// Then define the Product interface
interface Product {
  _id: number;
  id: number;
  cityName: string;
  productdescription: string;
  wifi: string;
  tourService: string;
  discountend: number;
  duration: string;
  price: number;
  adultBaseprice: number;
  pickUp: number;
  discountPercentage: number;
  discountedTotal: number;
  cityImage: string;
  imageUrl: string;
  citydescription: string;
  producttitle: string;
  title: string;
  thumbnail: string[];
  categorie: string;
  inclusions?: string[];
  timings?: Timings;
  usefulInfo?: string;
}

@Component({
  selector: 'app-citydetails',
  imports: [CommonModule, RouterLink, NgxSkeletonLoaderModule],
  templateUrl: './citydetails.component.html',
  styleUrl: './citydetails.component.css',
})
export class CitydetailsComponent implements OnInit {
  deplist: any[] = [];
  products: Product[] = [];
  displayedProducts: Product[] = [];
  uniqueCategories: string[] = [];
  selectedCategories: string[] = [];
  skeletonArray: number[] = [];
  isloader: boolean = false;
  cityName: string | null = null;

  // Modal properties
  showModal: boolean = false;
  modalTitle: string = '';
  modalContent: any; // Changed to any to handle different content types
  currentProduct: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.generateSkeletons(8);
    this.cityName = this.route.snapshot.queryParamMap.get('cityName');
    if (this.cityName) {
      this.fetchCityDetails();
    }
  }

  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }

  icons = [
    { icon: 'fas fa-pencil-alt', text: 'Description', bgColor: 'bg-red-500' },
    { icon: 'fas fa-plus', text: 'Inclusion', bgColor: 'bg-yellow-500' },
    { icon: 'fas fa-clock', text: 'Timings', bgColor: 'bg-blue-500' },
    { icon: 'fas fa-info', text: 'Useful Info', bgColor: 'bg-orange-500' },
  ];

  fetchCityDetails() {
    this.isloader = true;
    this.generateSkeletons(8);
    this.http
      .get<any>(`http://localhost:4000/api/city?cityName=${this.cityName}`)
      .subscribe((response) => {
        this.products = response.producte.map((product: Product) => ({
          id: product.id,
          _id: product._id,
          cityName: product.cityName,
          price: product.price,
          citydescription: product.citydescription,
          discountend: product.discountend,
          adultBaseprice: product.adultBaseprice,
          discountedTotal: product.discountedTotal,
          discountPercentage: product.discountPercentage,
          productdescription: product.productdescription,
          producttitle: product.producttitle,
          categorie: product.categorie,
          inclusions: product.inclusions || [
            'Once you fill out our form online and do the needful you will receive a confirmation on your screens immediately.',
            'You will also receive an email confirmation from our booking team confirming the details of your trip.',
            'There would be a follow via phone call (on International Number) before the trips due date, you will also receive text messages via WHATS APP on the developments leading to your visit to the Arabian Deserts.',
          ],
          timings: product.timings || {
            duration: product.duration,
            discountend: product.discountend,
            departurePoint: product.tourService,
            pickupTime: product.pickUp,
            wifi: product.wifi,
          },
usefulInfo: product.usefulInfo || `
  <ul class="list-disc pl-5 space-y-1">
    <li>Carry comfortable clothes suitable for Pakistan's weather.</li>
    <li>Keep your ID or passport handy during hotel and travel check-ins.</li>
    <li>Local currency is PKR; make sure to carry some cash.</li>
    <li>Respect local customs and traditions when visiting religious sites.</li>
    <li>Stay hydrated and carry water, especially in hot regions.</li>
  </ul>
`,

            imageUrl: this.sanitizer.bypassSecurityTrustUrl(
            `http://localhost:4000/uploads/${product.thumbnail[0]}`
          ),
        }));
        this.isloader = false;
        this.displayedProducts = [...this.products];
        this.uniqueCategories = [
          ...new Set(this.products.map((product) => product.categorie)),
        ];
      });
  }

  // Modal functions
  openModal(product: Product, type: string) {
    this.currentProduct = product;
    this.modalTitle = type;

    switch (type) {
      case 'Description':
        this.modalContent = product.citydescription;
        break;
      case 'Inclusion':
        // We'll handle inclusions directly in the template
        this.modalContent = null;
        break;
      case 'Timings':
        // Assign the timings object
        this.modalContent = product.timings || {
          duration: product.duration,
          departurePoint: product.tourService,
          pickupTime: product.pickUp,
          wifi: product.wifi,
        };
        break;
      case 'Useful Info':
        this.modalContent = product.usefulInfo || 'Not available';
        break;
    }

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentProduct = null;
  }

  onCategoryFilterChange(event: any) {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (c) => c !== category
      );
    }
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedCategories.length === 0) {
      this.displayedProducts = [...this.products];
    } else {
      this.displayedProducts = this.products.filter((product) =>
        this.selectedCategories.includes(product.categorie)
      );
    }
  }

  getCategoryCount(category: string): number {
    return this.products.filter((product) => product.categorie === category)
      .length;
  }

  checkbox: boolean = true;
  toggleCheckbox(): void {
    this.checkbox = !this.checkbox;
  }

  checkbox2: boolean = true;
  toggleCheckbox2(): void {
    this.checkbox2 = !this.checkbox2;
  }
}
