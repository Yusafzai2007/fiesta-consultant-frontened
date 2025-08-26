import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import Swiper from 'swiper';

@Component({
  selector: 'app-local-guide',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './local-guide.component.html',
  styleUrls: ['./local-guide.component.css'] // ✅ use `styleUrls` (plural)
})
export class LocalGuideComponent implements OnInit {
  cities: Array<{ id: number, name: string, imageUrl: any, cityName: string }> = [];
  skeletonArray: number[] = [];
  isloader: boolean = false;
  private isBrowser: boolean;
  private swiperInitialized = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.generateSkeletons(4);
    this.fetchProductData();
  }

  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }

  fetchProductData() {
    this.isloader = true;
    this.http.get<any>('http://localhost:4000/api/home').subscribe({
      next: (response) => {
        this.cities = response.distinctCities.map((product: any) => ({
          id: product.id,
          name: product.cityName,
          imageUrl: this.sanitizer.bypassSecurityTrustUrl(`http://localhost:4000/uploads/${product.cityImage}`),
          cityName: product.cityName
        }));
        this.isloader = false;
        setTimeout(() => this.initSwiper(), 100); // ⏳ small delay after data
      },
      error: (err) => {
        this.isloader = false;
        console.error('Error loading cities:', err);
      }
    });
  }

  initSwiper() {
    if (this.isBrowser && !this.swiperInitialized) {
      const wrapper = document.querySelector('.blogCategoriesSwiper .swiper-wrapper');
      if (wrapper && wrapper.children.length > 0) {
        new Swiper('.blogCategoriesSwiper', {
          loop: true,
          spaceBetween: 16,
          grabCursor: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }
        });
        this.swiperInitialized = true;
      }
    }
  }









para1: string = 'At our company Pakistan Travel and Tourism, we provide utmost care to our members who take out time from their busy schedules to attend meetings or tours that result in brand promotion and professional development. Our main aim is to ensure that every detail, no matter how small, meets the highest standard. We regard our members as the most prized assets of our company, as their participation in meetings and tours positively reflects on our organization. Our relationships with our members are extremely valuable. We truly value the importance of each individual who connects with us. That’s why we provide top-tier hospitality within an affordable budget. Our dedicated team is always ready to offer excellent customer care. No issue is too big or too small for our crew to handle. We strive to make luxury accommodation economical for our clients’ convenience. At Pakistan Travel and Tourism, we believe in clarity and satisfaction, resolving all client queries and concerns efficiently. Our streamlined application process keeps clients engaged and comfortable. Additionally, our partnership networks across South Asia allow us to collaborate with hotels on annual commitments. Over the years, we’ve expanded across various Asian countries — especially within Pakistan. Our meetings host some of the most experienced professionals who are driven, innovative, and results-oriented. Our core strength lies in our unmatched networking and coordination capabilities.';


para2: string = 'We have a highly trained team dedicated to designing and executing events in the most efficient way possible. We provide complete solutions for exhibitions, booth design, and fabrication. Our creative team works tirelessly to bring your ideas to life, customizing everything according to your brand, needs, and budget. Our services also include air-conditioned setups and the creation of fully functional purchase points for exhibitions and trade shows.';



para3: string = 'We understand the importance of every detail in your conferences and seminars. That’s why our team works with full commitment to ensure the success of your event — whether it’s the launch of a new brand to attract potential clients, retention campaigns for existing customers, annual conferences, or informal meetings. Our expert team is prepared to manage everything professionally, ensuring smooth execution with no glitches.';


para4: string = 'We offer one-stop solutions for all your corporate event needs — including team meetups, award ceremonies, or even small gatherings. With years of experience, we have built a strong reputation as one of the best corporate event management companies in Pakistan. Our team works tirelessly to fulfill every customer requirement — from stage design and fabrication to lighting and sound setup. For every event, we aim to deliver creative ideas within a budget-friendly plan. Whether it’s a team gathering or a full-scale corporate function, we can manage it all. Our primary goal is to ensure smooth coordination and a welcoming, friendly environment throughout the event.';










}
