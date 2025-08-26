import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddProductService } from '../adminservice/add-product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  productData: any = {
    private: false,
    shared: false,
    privateAdult: null,
    privateChild: null,
    privatetransferprice: null,
    thumbnail: [],
  };
  cityImageFile: File | null = null;
  thumbnailFiles: File[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private service: AddProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProductData(id);
    }
  }

  loadProductData(id: string): void {
    this.loading = true;
    this.service.getProductById(id).subscribe({
      next: (data) => {
        this.productData = data.product;
        this.initializeFormData();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load product data';
        console.error('Loading error:', err);
        this.loading = false;
      },
    });
  }

  private initializeFormData(): void {
    // Initialize boolean fields
    this.productData.private = this.productData.private || false;
    this.productData.shared = this.productData.shared || false;

    // Initialize private fields
    this.productData.privateAdult = this.productData.privateAdult || null;
    this.productData.privateChild = this.productData.privateChild || null;
    this.productData.privatetransferprice =
      this.productData.privatetransferprice || null;

    // Format date
    if (this.productData.discountend) {
      const date = new Date(this.productData.discountend);
      this.productData.discountend = date.toISOString().split('T')[0];
    }

    // Initialize thumbnail array if empty
    if (!this.productData.thumbnail) {
      this.productData.thumbnail = [];
    }

    // Calculate discounted price if not set
    if (!this.productData.discountedTotal) {
      this.autoCalculateDiscountedTotal();
    }
  }

  onThumbnailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.thumbnailFiles = Array.from(input.files);
    }
  }

  onCityImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cityImageFile = input.files[0];
    }
  }

  removeExistingThumbnail(index: number): void {
    this.productData.thumbnail.splice(index, 1);
  }

  handleFieldChange(fieldKey: string): void {
    if (fieldKey === 'adultBaseprice' || fieldKey === 'discountPercentage') {
      this.autoCalculateDiscountedTotal();
    }
  }

  autoCalculateDiscountedTotal(): void {
    const base = Number(this.productData.adultBaseprice);
    const discount = Number(this.productData.discountPercentage);

    if (!isNaN(base) && !isNaN(discount)) {
      const discounted = base - (base * discount) / 100;
      this.productData.discountedTotal = Math.round(discounted);
    } else {
      this.productData.discountedTotal = null;
    }
  }

  validatePrivateFields(): void {
    if (this.productData.private) {
      this.productData.privateAdult = this.productData.privateAdult
        ? Number(this.productData.privateAdult)
        : null;
      this.productData.privateChild = this.productData.privateChild
        ? Number(this.productData.privateChild)
        : null;
      this.productData.privatetransferprice = this.productData
        .privatetransferprice
        ? Number(this.productData.privatetransferprice)
        : null;
    } else {
      this.productData.privateAdult = null;
      this.productData.privateChild = null;
      this.productData.privatetransferprice = null;
    }
  }

  updateProduct(): void {
    this.errorMessage = '';
    this.validatePrivateFields();

    if (!this.validateForm()) {
      return;
    }

    const formData = new FormData();
    const id = this.productData._id;

    if (!id) {
      this.errorMessage = 'Product ID is missing';
      return;
    }

    // Append all fields except files and internal fields
    Object.keys(this.productData).forEach((key) => {
      if (
        ![
          '_id',
          '_v',
          'createdAt',
          'updatedAt',
          'thumbnail',
          'cityImage',
        ].includes(key) &&
        this.productData[key] !== null &&
        this.productData[key] !== undefined
      ) {
        formData.append(key, this.productData[key]);
      }
    });

    // Handle files
    if (this.cityImageFile) {
      formData.append('cityImage', this.cityImageFile);
    } else if (this.productData.cityImage) {
      formData.append('cityImage', this.productData.cityImage);
    }

    if (this.thumbnailFiles.length > 0) {
      this.thumbnailFiles.forEach((file) => formData.append('thumbnail', file));
    }

    if (this.productData.thumbnail?.length > 0) {
      this.productData.thumbnail.forEach((thumb: string) => {
        formData.append('existingThumbnails', thumb);
      });
    }

    this.loading = true;
    this.service.updateProduct(id, formData).subscribe({
      next: (res) => {
        alert('Product updated successfully!');
        this.loading = false;
      },
      error: (err) => {
        console.error('Update error:', err);
        this.errorMessage =
          err.error?.message || 'Update failed. Please try again.';
        this.loading = false;
      },
    });
  }

  private validateForm(): boolean {
    if (!this.productData.producttitle) {
      this.errorMessage = 'Product title is required';
      return false;
    }

    if (this.productData.private) {
      if (
        this.productData.privateAdult === null ||
        isNaN(this.productData.privateAdult)
      ) {
        this.errorMessage = 'Private adult price is required';
        return false;
      }
    }

    // Add more validations as needed
    return true;
  }
}
