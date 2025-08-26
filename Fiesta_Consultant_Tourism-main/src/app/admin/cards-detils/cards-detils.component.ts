import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cards-detils',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cards-detils.component.html',
  styleUrl: './cards-detils.component.css',
})
export class CardsDetilsComponent {
  userId: string = '';
  cardData: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (this.userId) {
      this.fetchCardData();
    } else {
      this.error = 'User ID not provided';
    }
  }

  fetchCardData() {
    this.isLoading = true;
    this.http
      .get<any>(
        `http://localhost:4000/api/userordersdetails?userId=${this.userId}`,
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (res) => {
          this.cardData = res.orders?.[0] || null;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to fetch card data';
          this.isLoading = false;
        },
      });
  }
}
