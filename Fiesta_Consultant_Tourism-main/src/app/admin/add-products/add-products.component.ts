import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddProductService } from '../adminservice/add-product.service';

@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit {
  constructor(private postproduct: AddProductService) {}

  AddproductForm: FormGroup = new FormGroup({
    producttitle: new FormControl('', Validators.required),
    productdescription: new FormControl('', Validators.required),
    thumbnail: new FormControl(null, Validators.required),
    tourService: new FormControl('Daily', Validators.required),
    duration: new FormControl('', Validators.required),
    transportService: new FormControl(
      'Pick up & Drop Back',
      Validators.required
    ),
    pickUp: new FormControl('', Validators.required),
    translatelanguage: new FormControl('English/Urdu', Validators.required),
    wifi: new FormControl('available', Validators.required),
    adultBaseprice: new FormControl('', Validators.required),
    kidsBaseprice: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    discountend: new FormControl('', Validators.required),
    discountPercentage: new FormControl('', Validators.required),
    discountedTotal: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    private: new FormControl(false), // New toggle
    privateAdult: new FormControl(''),
    privateChild: new FormControl(''),
    privatetransferprice: new FormControl(''),
    cityName: new FormControl('', Validators.required),
    citydescription: new FormControl('', Validators.required),
    cityImage: new FormControl(null, Validators.required),
    categorie: new FormControl('', Validators.required),
  });

  thumbnailFiles: File[] = [];
  cityImageFile: File | null = null;

  ngOnInit(): void {
    this.subscribeToDiscountLogic();
    this.handlePrivateToggle();
  }

  subscribeToDiscountLogic(): void {
    this.AddproductForm.get('adultBaseprice')?.valueChanges.subscribe(() => {
      this.updateDiscountedTotal();
    });

    this.AddproductForm.get('discountPercentage')?.valueChanges.subscribe(
      () => {
        this.updateDiscountedTotal();
      }
    );
  }

  updateDiscountedTotal(): void {
    const adultBaseprice = parseFloat(
      this.AddproductForm.get('adultBaseprice')?.value
    );
    const discount = parseFloat(
      this.AddproductForm.get('discountPercentage')?.value
    );

    if (!isNaN(adultBaseprice) && !isNaN(discount)) {
      const discountedTotal =
        adultBaseprice - (adultBaseprice * discount) / 100;
      const rounded = Math.round(discountedTotal);
      this.AddproductForm.get('discountedTotal')?.setValue(rounded, {
        emitEvent: false,
      });
    } else {
      this.AddproductForm.get('discountedTotal')?.setValue('', {
        emitEvent: false,
      });
    }
  }

  handlePrivateToggle(): void {
    this.AddproductForm.get('private')?.valueChanges.subscribe(
      (isPrivate: boolean) => {
        const privateAdult = this.AddproductForm.get('privateAdult');
        const privateChild = this.AddproductForm.get('privateChild');
        const privatetransferprice = this.AddproductForm.get(
          'privatetransferprice'
        );

        if (isPrivate) {
          privateAdult?.setValidators(Validators.required);
          privateChild?.setValidators(Validators.required);
          privatetransferprice?.setValidators(Validators.required);
        } else {
          privateAdult?.clearValidators();
          privateChild?.clearValidators();
          privatetransferprice?.clearValidators();
        }

        privateAdult?.updateValueAndValidity();
        privateChild?.updateValueAndValidity();
        privatetransferprice?.updateValueAndValidity();
      }
    );
  }

  onThumbnailChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.thumbnailFiles = Array.from(files);
      this.AddproductForm.patchValue({ thumbnail: this.thumbnailFiles });
    }
  }

  onCityImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.cityImageFile = file;
      this.AddproductForm.patchValue({ cityImage: this.cityImageFile });
    }
  }

  Save(): void {
    this.AddproductForm.get('discountedTotal')?.enable();

    if (this.AddproductForm.invalid) {
      console.error('Form is invalid', this.AddproductForm.errors);
      alert('Please fill all required fields');
      return;
    }

    const formValues = this.AddproductForm.getRawValue();
    formValues.discountend = new Date(formValues.discountend).toISOString();

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key !== 'thumbnail' && key !== 'cityImage') {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      }
    });

    if (this.cityImageFile) {
      formData.append('cityImage', this.cityImageFile);
    }

    this.thumbnailFiles.forEach((file) => {
      formData.append('thumbnail', file);
    });

    for (const [key, value] of formData.entries()) {
      // console.log(`${key}:`, value);
    }

    this.postproduct.postProduct(formData).subscribe(
      (res) => {
        alert('✅ Product has been added successfully!');
        this.AddproductForm.reset();
        this.thumbnailFiles = [];
        this.cityImageFile = null;
        this.AddproductForm.get('discountedTotal')?.disable();
      },
      (error) => {
        console.error('❌ Error:', error);
        alert(`Error: ${error.error?.msg || 'Something went wrong'}`);
        this.AddproductForm.get('discountedTotal')?.disable();
      }
    );
  }
}
