import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceNameService } from '../service-name.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-producttable',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './producttable.component.html',
  styleUrls: ['./producttable.component.css'],
})
export class ProducttableComponent implements OnInit {
  productData: any;
  formData: any;
  cartItems: any[] = [];
  personalDetailsForm: FormGroup;
  isLoading = false;
  successful:boolean = false;

  paymentMethods = ['Visa', 'Mastercard', 'American Express', 'Discover'];
  countries = [
    'Afghanistan',
    'Algeria',
    'Angola',
    'Argentina',
    'Armenia',
    'Azerbaijan',
    'Bahrain',
    'Brazil',
    'Yemen',
    'Zimbabwe',
  ];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private depsrv: ServiceNameService,
    private router: Router,
    private http: HttpClient
  ) {
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      nameOnCard: ['', Validators.required],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}[\s-]?\d{4}[\s-]?\d{4}$/),
        ],
      ],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['', Validators.required],
      expiry: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      NoofAdult: [''],
      NoofChild: [''],
      privateAdult: [''],
      privateChild: [''],
      Transfer: ['', Validators.required],
      Total: ['', Validators.required],
      productId: [''],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    // Get data from service
    this.formData = this.depsrv.getFormData();
    this.productData = this.depsrv.getProductData();
    const cartData = this.depsrv.getCartData();

    // Check if we have cart data
    if (cartData) {
      this.cartItems = Array.isArray(cartData) ? cartData : [cartData];
      this.patchFormValues();
      this.isLoading = false;
    } else if (this.productData) {
      // If we have product data but no cart data
      this.patchFormValues();
      this.isLoading = false;
    } else {
      // Fallback to API call if no data in service
      this.loadCartFromAPI();
    }
  }

  loadCartFromAPI(): void {
    this.http
      .get<any>('http://localhost:4000/api/cart', { withCredentials: true })
      .subscribe({
        next: (res) => {
          if (res.cart && res.cart.length > 0) {
            this.cartItems = res.cart;
          }
          this.patchFormValues();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching cart data:', err);
          this.isLoading = false;
        },
      });
  }

  patchFormValues(): void {
    if (this.cartItems.length > 0) {
      const firstItem = this.cartItems[0];
      this.personalDetailsForm.patchValue({
        NoofAdult: firstItem.adults_no || firstItem.privateAdult || '',
        NoofChild: firstItem.kids_no || firstItem.privateChild || '',
        privateAdult: firstItem.privateAdult || '',
        privateChild: firstItem.privateChild || '',
        Transfer: firstItem.transfertype || '',
        Total: firstItem.total || firstItem.privatetransferprice || '',
        productId: firstItem.productId || '',
      });
    } else if (this.formData) {
      this.personalDetailsForm.patchValue({
        NoofAdult: this.formData?.NoofAdult || '',
        NoofChild: this.formData?.NoofChild || '',
        privateAdult: this.formData?.privateAdult || '',
        privateChild: this.formData?.privateChild || '',
        Transfer: this.formData?.Transfer || '',
        Total: this.formData?.Total || '',
        productId: this.productData?._id || '',
      });
    }
  }

  navigateToPage(): void {
    this.router.navigate(['/main']);
  }

  onSubmit(): void {
    if (this.isLoading) {
      alert('Please wait while we load your data...');
      return;
    }

    if (this.personalDetailsForm.invalid) {
      this.logValidationErrors();
      alert('Please fill all required fields correctly.');
      return;
    }

    const form = this.personalDetailsForm.value;
    let productsArray = [];

    if (this.cartItems.length > 0) {
      // Process all cart items
      productsArray = this.cartItems.map((item) => ({
        productId: item.productId,
        producttitle: item.producttitle,
        productdescription: item.productdescription,
        cityName: item.cityName,
        citydescription: item.citydescription,
        cityImage: item.cityImage,
        tourService: item.tourService,
        duration: item.duration,
        transportService: item.transportService,
        pickUp: item.pickUp,
        price: item.price,
        discountedTotal: item.discountedTotal,
        adultBaseprice: item.adultBaseprice,
        kidsBaseprice: item.kidsBaseprice,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        categorie: item.categorie,
        translatelanguage: item.translatelanguage,
        wifi: item.wifi,
        adults_no: item.transfertype === 'Shared' ? item.adults_no : null,
        kids_no: item.transfertype === 'Shared' ? item.kids_no : null,
        privateAdult:
          item.transfertype === 'Private' ? item.privateAdult : null,
        privateChild:
          item.transfertype === 'Private' ? item.privateChild : null,
        transfertype: item.transfertype,
        transferPrice:
          item.transfertype === 'Shared' ? item.transferPrice : null,
        privatetransferprice:
          item.transfertype === 'Private' ? item.privatetransferprice : null,
        total: item.total || item.privatetransferprice,
        order_date: new Date().toLocaleDateString(),
      }));
    } else if (this.productData) {
      // Process single product
      productsArray = [
        {
          productId: this.productData._id,
          producttitle: this.productData.producttitle,
          productdescription: this.productData.productdescription,
          cityName: this.productData.cityName,
          citydescription: this.productData.citydescription,
          cityImage: this.productData.cityImage,
          tourService: this.productData.tourService,
          duration: this.productData.duration,
          transportService: this.productData.transportService,
          pickUp: this.productData.pickUp,
          price: this.productData.price,
          discountedTotal: this.productData.discountedTotal,
          adultBaseprice: this.productData.adultBaseprice,
          kidsBaseprice: this.productData.kidsBaseprice,
          quantity: this.productData.quantity,
          thumbnail: this.productData.thumbnail,
          categorie: this.productData.categorie,
          translatelanguage: this.productData.translatelanguage,
          wifi: this.productData.wifi,
          adults_no: form.Transfer === 'Shared' ? form.NoofAdult : null,
          kids_no: form.Transfer === 'Shared' ? form.NoofChild : null,
          privateAdult: form.Transfer === 'Private' ? form.privateAdult : null,
          privateChild: form.Transfer === 'Private' ? form.privateChild : null,
          transfertype: form.Transfer,
          transferPrice:
            form.Transfer === 'Shared'
              ? this.productData.sharedTransferPrice
              : null,
          privatetransferprice:
            form.Transfer === 'Private'
              ? this.productData.privatetransferprice
              : null,
          total: form.Total,
          order_date: new Date().toLocaleDateString(),
        },
      ];
    } else {
      alert('No products found to book. Please add products to your cart.');
      return;
    }

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      address: form.address,
      payment_Method: form.paymentMethod,
      city: form.city,
      state: form.state,
      country: form.country,
      name_On_Card: form.nameOnCard,
      card_Number: form.cardNumber,
      zip: Number(form.zip),
      expiry: form.expiry,
      cvv: form.cvv,
      products: productsArray,
      date: new Date().toLocaleDateString(),
    };

    console.log('Payload to be sent:', payload);

    this.http
      .post('http://localhost:4000/api/cart', payload, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // alert('Booking Successful!');
          // this.router.navigate(['/main']);
          this.successful = true;
        },
        error: (err) => {
          console.error('Error posting data:', err);
          alert('Something went wrong. Please try again.');
        },
      });
  }

  logValidationErrors(): void {
    Object.keys(this.personalDetailsForm.controls).forEach((key) => {
      const controlErrors = this.personalDetailsForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`Validation errors for ${key}:`, controlErrors);
      }
    });
  }

  // removeFromCart(item: any): void {
  //   if (!item?.productId) {
  //     console.error('Invalid product item:', item);
  //     return;
  //   }

  //   this.http.get(`http://localhost:4000/remove-from-cart?productId=${item.productId}`,
  //     { withCredentials: true }
  //   ).subscribe({
  //     next: (res: any) => {
  //       this.cartItems = this.cartItems.filter(i => i.productId !== item.productId);
  //       alert(res.message || 'Item removed successfully');
  //     },
  //     error: (err) => {
  //       console.error('Error removing item:', err);
  //       alert(err.error?.message || 'Failed to remove item');
  //     }
  //   });
  // }

  // component.ts

  showModal = false;
  selectedItem: any = null;

  confirmDelete(item: any): void {
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedItem = null;
  }

  deleteConfirmed(): void {
    const item = this.selectedItem;
    if (!item?.productId) {
      console.error('Invalid product item:', item);
      this.closeModal();
      return;
    }

    this.http
      .get(
        `http://localhost:4000/remove-from-cart?productId=${item.productId}`,
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (res: any) => {
          if (
            res.status === 200 &&
            res.message === 'if the cart is now empty'
          ) {
            alert('Cart is empty now. Redirecting...');
            this.router.navigate(['/main']);
          } else {
            this.cartItems = this.cartItems.filter(
              (i) => i.productId !== item.productId
            );
            // alert(res.message || '');
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Error removing item:', err);
          alert(err.error?.message || 'Failed to remove item');
          this.closeModal();
        },
      });
  }

}
