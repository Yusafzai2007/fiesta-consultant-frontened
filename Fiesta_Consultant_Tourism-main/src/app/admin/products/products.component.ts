import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddProductService } from '../adminservice/add-product.service';
import { Router } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  // Loading states
  skeletonArray: number[] = [];
  isloader: boolean = true;
  errorMessage: string | null = null;

  // Product data
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  pagedProducts: any[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;

  // Filters
  selectedCategory: string = '';
  selectedCity: string = '';
  uniqueCategories: string[] = [];
  uniqueCities: string[] = [];

  // Modal
  modalType: 'text' | 'images' | 'description' | 'private-transfer' | null =
    null;
  modalData: any;

  constructor(
    private http: HttpClient,
    private productService: AddProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateSkeletons(5);
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  generateSkeletons(count: number): void {
    this.skeletonArray = Array(count).fill(0);
  }

  loadProducts(): void {
    this.isloader = true;
    this.errorMessage = null;

    this.http
      .get<any>('http://localhost:4000/api/admin', {
        withCredentials: true,
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(res: any): void {
    if (!res?.products) {
      this.handleError(new Error('Invalid API response structure'));
      return;
    }

    setTimeout(() => {
      this.allProducts = res.products;
      this.filteredProducts = [...this.allProducts];

      this.uniqueCategories = [
        ...new Set(this.allProducts.map((p) => p.categorie || 'Uncategorized')),
      ];
      this.uniqueCities = [
        ...new Set(this.allProducts.map((p) => p.cityName || 'Unknown')),
      ];

      this.calculatePagination();
      this.isloader = false;
    });
  }

  private handleError(error: HttpErrorResponse | Error): void {
    console.error('Error:', error);
    this.errorMessage =
      error instanceof HttpErrorResponse
        ? `Server error: ${error.status} - ${error.message}`
        : error.message;

    this.allProducts = [];
    this.filteredProducts = [];
    this.calculatePagination();
    this.isloader = false;
  }

  // Add this to your component properties
selectedTitle: string = '';

// Update the applyFilters method
applyFilters(): void {
  this.filteredProducts = this.allProducts.filter((product) => {
    const matchesCategory =
      !this.selectedCategory || product.categorie === this.selectedCategory;
    const matchesCity =
      !this.selectedCity || product.cityName === this.selectedCity;
    const matchesTitle = !this.selectedTitle || 
      product.producttitle.toLowerCase().includes(this.selectedTitle.toLowerCase());
    
    return matchesCategory && matchesCity && matchesTitle;
  });

  this.resetToFirstPage();
}

// Update the resetFilters method
resetFilters(): void {
  this.selectedCategory = '';
  this.selectedCity = '';
  this.selectedTitle = '';
  this.filteredProducts = [...this.allProducts];
  this.resetToFirstPage();
}

  private calculatePagination(): void {
    this.totalPages =
      Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1;
    this.updatePagedProducts();
  }

  private updatePagedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  private resetToFirstPage(): void {
    this.currentPage = 1;
    this.calculatePagination();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedProducts();
    }
  }

  onItemsPerPageChange(): void {
    this.resetToFirstPage();
  }

  openModal(type: 'text' | 'images' | 'description', data: any): void {
    this.modalType = type;
    this.modalData = data;
  }

  openPrivateTransferModal(product: any): void {
    this.modalType = 'private-transfer';
    this.modalData = {
      privateAdult: product.privateAdult,
      privateChild: product.privateChild,
      privatetransferprice: product.privatetransferprice,
    };
  }

  closeModal(): void {
    this.modalType = null;
    this.modalData = null;
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService
        .deleteProduct(productId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => this.loadProducts(),
          error: (err) => {
            console.error('Delete failed:', err);
            alert('Failed to delete product');
          },
        });
    }
  }

  onEdit(id: string): void {
    this.router.navigate(['/admin/edit', id]);
  }

  tableheader = [
    { label: 'Image' },
    { label: 'Title' },
    { label: 'City' },
    { label: 'Category' },
    { label: 'Adult ' },
    { label: 'Kids' },
    { label: 'Dis' },
    { label: 'Final' },
    { label: 'TransportService' },
    { label: 'Tour ' },
    { label: 'Language ' },
    { label: 'City disc' },
    { label: 'Product Des' },
    { label: 'Tour Type' },
    { label: 'Edit' },
    { label: 'Delete' },
  ];
}
