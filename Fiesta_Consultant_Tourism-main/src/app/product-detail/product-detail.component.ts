import {
  Component,
  OnInit,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ServiceNameService } from '../service-name.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

declare var Swiper: any;

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    NgxSkeletonLoaderModule,
    RouterLink,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  errorMessage: string | null = null;
  skeletonArray: number[] = [];
  isloader: boolean = false;

  minDate: string = '';
  selectedDate: string = '';
  form: boolean = false;
  isapi: boolean = false;

  showMore: boolean = false;
  showError: boolean = false;
  result: number | null = null;

  productDetails: any = undefined;
  swiper: any;
  thumbnailSwiper: any;
  showPrivateForm: boolean = false;

  depsrv: ServiceNameService;

  constructor(
    private service: ServiceNameService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.depsrv = service;
  }

  userobj: any = {
    Date: '',
    NoofAdult: '',
    Transfer: '',
    NoofChild: '',
    privateAdult: 0,
    privateChild: 0,
    Total: null,
    UsedAdultRate: 0,
    UsedChildRate: 0,
  };



  
  button = [
    { icon: 'fa-solid fa-calendar-days text-red-500 ', label: 'TourService' },
    { icon: 'fa-solid fa-hourglass-half  text-indigo-600', label: 'Duration' },
    {
      icon: 'fa-solid fa-car text-pink-600 ',
      textClass: 'text-nowrap',
      label: '',
    },
    { icon: 'fa-regular fa-clock  text-green-600 ', label: 'PickUp' },
    { icon: 'fa-solid fa-language  text-indigo-600', label: 'Lang' },
    {
      icon: 'fa-solid fa-wifi  text-red-500 ',
      textClass: 'text-sm',
      label: 'Free',
    },
    { icon: 'fa-solid fa-vault  text-orange-500', label: 'Adult' },
    { icon: 'fa-solid fa-vault  text-pink-600', label: 'Child' },
  ];

  features = [
    {
      icon: 'fas fa-tags text-red-600 rotate-45',
      text: 'BEST PRICE GUARANTEE',
      route: '/Product_details',
    },
    {
      icon: 'fas fa-comments text-green-600 text-2xl',
      text: '24X7 LIVE CHAT SUPPORT',
      route: '/Product_details',
    },
    {
      icon: 'fas fa-bookmark text-blue-600 text-2xl',
      text: 'FAST BOOKING',
      route: '/Product_details',
    },
    {
      icon: 'fas fa-star text-red-600 text-2xl',
      text: '5 STAR FACILITIES',
      route: '/Product_details',
    },
    {
      icon: 'fas fa-wifi text-blue-600 text-2xl',
      text: 'WIFI COMING SOON',
      route: '/Product_details',
    },
  ];

  ngOnInit(): void {
    this.generateSkeletons(8);

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;

    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      this.fetchProductDetails(productId);

      // Live changes tracking
      this.userobj.get?.('NoofAdult')?.valueChanges?.subscribe(() => {
        this.onBookNow();
      });
      this.userobj.get?.('NoofChild')?.valueChanges?.subscribe(() => {
        this.onBookNow();
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeSwiper();
      this.initializeThumbnailSwiper();
    }, 0);
  }

  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }

  fetchProductDetails(productId: string | null): void {
    if (!productId) return;

    this.isloader = true;

    this.service.getproductDepartment(productId).subscribe({
      next: (data: any) => {
        const product = data?.products || data?.product;
        if (!product) {
          this.productDetails = undefined;
          return;
        }

        this.productDetails = product;

        if (product.private) {
          this.userobj.privateAdult = product.privateAdult;
          this.userobj.privateChild = product.privateChild;
        }

        this.isloader = false;
      },
      error: () => {
        this.isloader = false;
        this.errorMessage = 'Failed to load product details.';
      },
    });
  }

  onBooknow() {
    this.isapi = true;
    setTimeout(() => {
      this.form = true;
      this.isapi = false;
    }, 2000);
  }

  isFormComplete(): boolean {
    return (
      this.userobj.Date &&
      this.userobj.NoofAdult &&
      this.userobj.Transfer &&
      (this.userobj.NoofChild || this.userobj.NoofChild === 0)
    );
  }

  onBookNow() {
    this.userobj.Transfer = 'Shared';
    const adultCount = Number(this.userobj.NoofAdult) || 0;
    const childCount = Number(this.userobj.NoofChild) || 0;

    if (adultCount === 0) {
      this.showError = true;
      this.errorMessage = '❌ At least 1 adult is required';
      this.result = null;
      return;
    }

    const rateAdult = this.productDetails?.adultBaseprice;
    const rateChild = this.productDetails?.kidsBaseprice;
    const discountPercentage = this.productDetails?.discountPercentage || 0;
    const maxQuantity = Number(this.productDetails?.quantity) || 0;

    const totalPeople = adultCount + childCount;
    if (maxQuantity && totalPeople > maxQuantity) {
      this.showError = true;
      this.errorMessage = `❌ Only ${maxQuantity} people allowed. You selected ${totalPeople}.`;
    } else {
      this.showError = false;
      this.errorMessage = '';
    }

    if (!rateAdult || !rateChild) {
      alert('Adult or Child rate is missing!');
      return;
    }

    const totalAdult = adultCount * rateAdult;
    const totalChild = childCount * rateChild;
    const total = totalAdult + totalChild;
    const discount = (total * discountPercentage) / 100;
    const finalTotal = total - discount;

    this.result = Math.round(finalTotal);
    this.userobj.Total = this.result;
    this.userobj.UsedAdultRate = rateAdult;
    this.userobj.UsedChildRate = rateChild;

    this.depsrv.setFormData(this.userobj);
  }

  onsignup() {
    // Calculate booking total first
    this.onBookNow();

    // Validate form completion
    if (!this.isFormComplete() || this.result === null) {
      alert(
        'Please complete the form and see the total bill before submitting.'
      );
      return;
    }

    const adultCount = Number(this.userobj.NoofAdult) || 0;
    const childCount = Number(this.userobj.NoofChild) || 0;
    const totalPeople = adultCount + childCount;
    const maxQuantity = Number(this.productDetails?.quantity);

    // Validate against product quantity
    if (maxQuantity && totalPeople > maxQuantity) {
      this.showError = true;
      this.errorMessage = `❌ Only ${maxQuantity} people allowed. You selected ${totalPeople}.`;
      return;
    }

    // Prepare request parameters
    const params = new HttpParams()
      .set('id', this.productDetails?._id)
      .set('transfertype', this.userobj.Transfer || 'Shared')
      .set('adults_no', adultCount)
      .set('kids_no', childCount)
      .set('total', this.result)
      .set('order_date', this.userobj.Date)
      .set('privateAdult', this.userobj.privateAdult || 0)
      .set('privateChild', this.userobj.privateChild || 0)
      .set(
        'privatetransferprice',
        this.productDetails?.privatetransferprice || 0
      );

    // Make API call
    this.http
      .get<any>('http://localhost:4000/api/booknow', {
        params,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // Handle conflict responses
          if (res.status === 409) {
            if (res.value !== undefined) {
              // Shared transfer quantity limit
              alert(
                `❌ Sorry! Only ${res.value} spots available for selected date.`
              );
            } else if (res.message) {
              // Private transfer already booked
              alert(`❌ ${res.message}`);
            } else {
              alert('❌ This booking is not available for the selected date.');
            }
            return;
          }

          // Handle successful booking
          if (res.status === 200 && res.cart) {
            // Prepare complete booking data
            const bookingData = {
              ...this.userobj,
              Total: this.result,
              productId: this.productDetails?._id,
              producttitle: this.productDetails?.title,
              thumbnail: this.productDetails?.thumbnail?.[0],
              cityName: this.productDetails?.cityName,
              citydescription: this.productDetails?.citydescription,
              tourService: this.productDetails?.tourService,
              duration: this.productDetails?.duration,
              transportService: this.productDetails?.transportService,
              pickUp: this.productDetails?.pickUp,
              discountPercentage: this.productDetails?.discountPercentage,
              discountedTotal: this.productDetails?.discountedTotal,
              quantity: this.productDetails?.quantity,
              productdescription: this.productDetails?.productdescription,
              categorie: this.productDetails?.categorie,
              translatelanguage: this.productDetails?.translatelanguage,
              wifi: this.productDetails?.wifi,
            };

            // Store data in services
            this.depsrv.setFormData(bookingData);
            this.depsrv.setCartData(res.cart);

            // Store product data if available
            if (this.productDetails?.thumbnail && this.productDetails?.title) {
              const apiData = {
                image: this.productDetails.thumbnail[0],
                title: this.productDetails.title,
                _id: this.productDetails._id,
              };
              this.depsrv.setProductData(apiData);
            }

            // Show success and navigate
            // alert('✅ Booking successful!');
            this.router.navigate(['/producttable']);
          }
        },
        error: (err) => {
          console.error('Booking API Error:', err);

          // Enhanced error handling
          if (err.status === 409) {
            if (err.error?.value !== undefined) {
              alert(
                `❌ Only ${err.error.value} spots available for selected date.`
              );
            } else if (err.error?.message) {
              alert(`❌ ${err.error.message}`);
            } else {
              alert('❌ This booking is not available for the selected date.');
            }
          } else if (err.status === 404) {
            alert('❌ Product not found or no longer available');
          } else if (err.status === 401) {
            alert('❌ Please login to complete your booking');
            this.router.navigate(['/login']);
          } else {
            alert('❌ Something went wrong while booking. Please try again.');
          }
        },
      });
  }
  onPrivateBookNow() {
    if (!this.userobj.Date) {
      alert('Please select a date.');
      return;
    }

    if (!this.productDetails?.private) {
      alert('This product does not offer private transfers.');
      return;
    }

    if (!this.productDetails.privatetransferprice) {
      alert('Private transfer price is not configured for this product.');
      return;
    }

    const params = new HttpParams()
      .set('id', this.productDetails._id)
      .set('transfertype', 'Private')
      .set('total', this.productDetails.privatetransferprice)
      .set('order_date', this.userobj.Date)
      .set('privateAdult', this.userobj.privateAdult)
      .set('privateChild', this.userobj.privateChild)
      .set('privatetransferprice', this.productDetails.privatetransferprice);

    console.log(
      'Sending private booking request with params:',
      params.toString()
    );

    this.http
      .get<any>('http://localhost:4000/api/booknow', {
        params,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          if (res.status === 409) {
            const errorMsg =
              res.message ||
              'Private transfer not available for the selected date';
            alert(`❌ ${errorMsg}`);
            return;
          }
          if (res.status === 200 && res.cart) {
            console.log('✅ Private booking cart data:', res.cart);

            // Prepare complete booking data
            const bookingData = {
              ...this.userobj,
              Total: this.productDetails.privatetransferprice,
              UsedAdultRate: this.productDetails.privateAdult,
              UsedChildRate: this.productDetails.privateChild,
              Transfer: 'Private',
              Date: this.userobj.Date,
              productId: this.productDetails._id,
              producttitle: this.productDetails.title,
              thumbnail: this.productDetails.thumbnail?.[0],
              cityName: this.productDetails.cityName,
              citydescription: this.productDetails.citydescription,
              tourService: this.productDetails.tourService,
              duration: this.productDetails.duration,
              transportService: this.productDetails.transportService,
              pickUp: this.productDetails.pickUp,
              discountPercentage: this.productDetails.discountPercentage,
              discountedTotal: this.productDetails.discountedTotal,
              quantity: this.productDetails.quantity,
              productdescription: this.productDetails.productdescription,
              categorie: this.productDetails.categorie,
              translatelanguage: this.productDetails.translatelanguage,
              wifi: this.productDetails.wifi,
            };

            this.depsrv.setFormData(bookingData);
            this.depsrv.setCartData(res.cart);

            if (this.productDetails.thumbnail && this.productDetails.title) {
              this.depsrv.setProductData({
                image: this.productDetails.thumbnail[0],
                title: this.productDetails.title,
                _id: this.productDetails._id,
              });
            }

            // alert('✅ Private transfer booked successfully!');
            this.router.navigate(['/producttable']);
          }
        },
        error: (err) => {
          console.error('Private transfer booking error:', err);

          let errorMessage = 'Failed to book private transfer';
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }

          alert(`❌ ${errorMessage}`);
        },
      });
  }

  initializeSwiper(): void {
    if (this.productDetails?.thumbnail?.length > 0) {
      this.swiper = new Swiper('.swiper-container', {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        navigation: {
          nextEl: '.custom-next-button',
          prevEl: '.custom-prev-button',
        },
      });
    }
  }

  initializeThumbnailSwiper(): void {
    if (this.productDetails?.thumbnail?.length > 0) {
      this.thumbnailSwiper = new Swiper('.thumbnail-swiper-container', {
        slidesPerView: 3,
        spaceBetween: 10,
        centeredSlides: true,
        slideToClickedSlide: true,
      });
    }
  }
}
