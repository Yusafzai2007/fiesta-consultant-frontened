import { Component, OnInit } from '@angular/core';
import { ServiceNameService } from '../service-name.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@Component({
  selector: 'app-cards',
  imports: [RouterLink, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  deplist: any[] = [];
  displayedProducts: any[] = [];
  productsToShow = 16;
  isButtonDisabled = false;
  skeletonArray: number[] = [];
  isloader: boolean = false;

  constructor(private depsrv: ServiceNameService) {}
  ngOnInit(): void {
    const cached = this.depsrv.getProducts();
    const cachedCount = this.depsrv.getCount();

    if (cached.length > 0) {
      this.deplist = cached;
      this.productsToShow = cachedCount;
      this.updateDisplayedProducts();
    } else {
      NgxSkeletonLoaderModule;
      this.generateSkeletons(8);
      this.fetchDepartmentData();
    }
  }

  fetchDepartmentData() {
    this.isloader = true;
    this.generateSkeletons(8);
    this.depsrv.getproductDepartment().subscribe(
      (res: any) => {
        this.deplist = res.products.map((item: any) => ({
          id: item._id,
          title: item.producttitle,
          image:
            item.thumbnail && item.thumbnail[0]
              ? `http://localhost:4000/uploads/${item.thumbnail[0]}`
              : '/assets/fallback-image-url.jpg',
          price: item.price,
          cityName: item.cityName,
          adultBaseprice: item.adultBaseprice,
          discountedTotal: item.discountedTotal,
          duration: item.duration,
          discountPercentage: item.discountPercentage,
          discription: item.productdescription,
        }));

        // Cache in service
        this.depsrv.setProducts(this.deplist);
        this.depsrv.setCount(this.productsToShow);

        this.isloader = false;
        this.updateDisplayedProducts();
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }
  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }

  updateDisplayedProducts() {
    this.displayedProducts = this.deplist.slice(0, this.productsToShow);
    this.checkButtonStatus();
  }

  showMore() {
    this.productsToShow += 8;
    this.updateDisplayedProducts();
    this.depsrv.setCount(this.productsToShow); // update saved count
  }
  checkButtonStatus() {
    if (this.displayedProducts.length >= this.deplist.length) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }
}
