import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceNameService } from '../service-name.service';
import Swiper from 'swiper';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-cardslider',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxSkeletonLoaderComponent],
  templateUrl: './cardslider.component.html',
  styleUrl: './cardslider.component.css',
})
export class CardsliderComponent implements OnInit, AfterViewInit {
  deplist: any[] = [];
  isLoading = true;
  errorOccurred = false;
  skeletonArray = new Array(4);
  private isBrowser: boolean;

  constructor(
    private depsrv: ServiceNameService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchDepartmentData();
  }

  fetchDepartmentData() {
    this.isLoading = true;
    this.depsrv.getproductDepartment().subscribe(
      (res: any) => {
        if (res?.products?.length > 0) {
          this.deplist = res.products.map((item: any) => ({
            id: item._id,
            title: item.producttitle,
            image:
              item.thumbnail && item.thumbnail[0]
                ? `http://localhost:4000/uploads/${item.thumbnail[0]}`
                : '/assets/fallback-image-url.jpg',
            price: item.price,
            cityName: item.cityName,
            duration: item.duration,
            discountPercentage: item.discountPercentage,
            discription: item.productdescription,
          }));
        }
        this.isLoading = false;
        this.initSwiper(); // initialize swiper after data loaded
      },
      (error) => {
        console.error('Error loading products:', error);
        this.errorOccurred = true;
        this.isLoading = false;
      }
    );
  }

  ngAfterViewInit(): void {
    // Swiper initialized after data is loaded in fetchDepartmentData
  }

  private initSwiper() {
    if (this.isBrowser) {
      setTimeout(() => {
        new Swiper('.card__container', {
          loop: true,
          spaceBetween: 12,
          grabCursor: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            600: { slidesPerView: 2 },
            968: { slidesPerView: 4 },
          },
        });
      }, 0);
    }
  }
}
