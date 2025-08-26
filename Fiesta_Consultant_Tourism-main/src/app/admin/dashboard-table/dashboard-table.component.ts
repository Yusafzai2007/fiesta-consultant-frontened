import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxSkeletonLoaderModule, FormsModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.css',
})
export class OrdersComponent {
  skeletonArray: number[] = [];
  isloader: boolean = true;
  userSummaries: any[] = [];
  originalUserSummaries: any[] = [];
  selectedUser: any = null;
  showDetails: boolean = false;
  selectedCity: string = '';
  selectedDate: string = '';
  today: Date = new Date();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.generateSkeletons(5);
    this.fetchData();
  }

  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }

  fetchData(): void {
    this.isloader = true;

    // Simulate loading delay for demo purposes
    setTimeout(() => {
      this.http
        .get<any>('http://localhost:4000/api/admin', {
          withCredentials: true,
        })
        .subscribe({
          next: (res) => {
            const orders = res.order ?? [];
            const userMap = new Map<string, any>();

            for (let order of orders) {
              const key = order.userEmail;
              const userId = order.userId;
              const name = order.userName;
              const address = order.address;
              const products: any[] = order.products ?? [];

              const total = products.reduce((sum: number, p: any) => {
                const shared = p.total || 0;
                const privateTransfer = p.privatetransferprice || 0;
                return sum + shared + privateTransfer;
              }, 0);

              const orderDate = new Date(order.date);
              const createdAt = new Date(order.createdAt);

              let firstThumbnail = null;
              for (let i = 0; i < products.length; i++) {
                if (products[i]?.thumbnail?.[0]) {
                  firstThumbnail = products[i].thumbnail[0];
                  break;
                }
              }

              if (!userMap.has(key)) {
                userMap.set(key, {
                  userId,
                  userName: name,
                  userEmail: key,
                  address,
                  total,
                  products: [...products],
                  latestDate: orderDate,
                  latestCreatedAt: createdAt,
                  thumbnail: firstThumbnail,
                  createdAt: createdAt,
                });
              } else {
                const existing = userMap.get(key);
                const extraTotal = products.reduce((sum: number, p: any) => {
                  return sum + (p.total || 0) + (p.privatetransferprice || 0);
                }, 0);
                existing.total += extraTotal;
                existing.products.push(...products);

                if (createdAt > existing.latestCreatedAt) {
                  existing.latestCreatedAt = createdAt;
                  existing.latestDate = orderDate;
                  if (!existing.thumbnail && firstThumbnail) {
                    existing.thumbnail = firstThumbnail;
                  }
                }
              }
            }

            this.userSummaries = Array.from(userMap.values())
              .filter((u) => u.total > 0)
              .sort((a, b) => {
                return (
                  b.latestCreatedAt.getTime() - a.latestCreatedAt.getTime()
                ); // Newest first
              })
              .slice(0, 6); // ✅ Only top 3

            this.originalUserSummaries = [...this.userSummaries];
            this.isloader = false;

            this.originalUserSummaries = [...this.userSummaries];
            this.isloader = false;
          },
          error: (err) => {
            console.error('Error:', err);
            this.isloader = false;
          },
        });
    }, 1000); // 1 second delay to show skeleton
  }

  showUserDetails(user: any) {
    this.selectedUser = user;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
  }

  applyFilter(): void {
    let filtered = [...this.originalUserSummaries];

    if (this.selectedCity.trim() !== '') {
      filtered = filtered.filter((user) =>
        user.products.some(
          (p: any) =>
            p.cityName?.toLowerCase().trim() ===
            this.selectedCity.toLowerCase().trim()
        )
      );
    }

    if (this.selectedDate) {
      const selectedDateStr = new Date(this.selectedDate).toLocaleDateString(
        'en-US'
      );
      filtered = filtered.filter((user) =>
        user.products.some((p: any) => {
          const productDateStr = new Date(p.order_date).toLocaleDateString(
            'en-US'
          );
          return productDateStr === selectedDateStr;
        })
      );
    }

    this.userSummaries = filtered;
  }

  resetFilters(): void {
    this.selectedCity = '';
    this.selectedDate = '';
    this.userSummaries = [...this.originalUserSummaries];
  }

  onEdit(id: string) {
    this.router.navigate(['/admin/edit', id]);
  }
}
