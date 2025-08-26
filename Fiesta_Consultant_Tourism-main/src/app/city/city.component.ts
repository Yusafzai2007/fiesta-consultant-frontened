import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CitydetailsComponent } from "../citydetails/citydetails.component";

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxSkeletonLoaderModule, CitydetailsComponent],
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'], // ⬅️ style**Urls** (not `styleUrl`)
})
export class CityComponent implements OnInit {
  cities: Array<{ id: number; name: string; imageUrl: any; cityName: string }> =
    [];
  skeletonArray: number[] = [];
  isloader: boolean = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.generateSkeletons(12); // or any default expected count
    this.fetchProductData();
  }

  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }

  fetchProductData() {
    this.isloader = true;
    this.generateSkeletons(12); // Optional: show 6 skeletons while loading
    this.http
      .get<any>('http://localhost:4000/api/home')
      .subscribe((response) => {
        this.cities = response.distinctCities.map((product: any) => ({
          id: product.id,
          name: product.cityName,
          imageUrl: this.sanitizer.bypassSecurityTrustUrl(
            `http://localhost:4000/uploads/${product.cityImage}`
          ),
          cityName: product.cityName,
        }));
        this.isloader = false;
      });
  }
}
