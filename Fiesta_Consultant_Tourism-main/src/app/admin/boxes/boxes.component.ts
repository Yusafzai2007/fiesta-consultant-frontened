import { Component } from '@angular/core';
import { DataService } from '../box/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id?: string;
  name?: string;
  email?: string;
}
interface Product {
  id?: string;
  name?: string;
}

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css'
})
export class BoxesComponent {
  cards: any[] = [];

  monthOptions: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  selectedMonth: string = ''; // 🔁 default: no month filter

  constructor(private admin: DataService) {
    this.loadData();
  }

  loadData() {
    this.admin.Total().subscribe({
      next: (res) => {
        const users: User[] = res.users ?? [];
        const allOrders: any[] = res.order ?? [];
        const products: Product[] = res.products ?? [];

        const currentYear = new Date().getFullYear();
        const selectedMonthIndex = this.monthOptions.indexOf(this.selectedMonth);

        let totalCash = 0;

        for (let order of allOrders) {
          if (Array.isArray(order.products)) {
            for (let product of order.products) {
              const dateStr = product.order_date || order.date;
              const orderDate = this.parseDate(dateStr);

              if (!orderDate || orderDate.getFullYear() !== currentYear) continue;

              // ✅ Filter by month if selected
              if (this.selectedMonth && orderDate.getMonth() !== selectedMonthIndex) continue;

              const total = Number(product.total ?? 0);
              const privateTransfer = Number(product.privatetransferprice ?? 0);
              totalCash += total + privateTransfer;
            }
          }
        }

        const label = this.selectedMonth
          ? `Cashed in ${this.selectedMonth} ${currentYear}`
          : `Cashed in ${currentYear}`;

        this.cards = [
          {
            title: 'Total Service',
            value: products.length,
            tag: 'Tourism',
            tagBg: 'bg-red-100',
            tagText: 'text-red-600',
            chartColor: '#fca5a5',
            icon: 'fa-solid fa-hotel'
          },
          {
            title: 'Total Client',
            value: users.length,
            tag: 'Tourism',
            tagBg: 'bg-red-100',
            tagText: 'text-red-600',
            chartColor: '#fca5a5',
            icon: 'fa-solid fa-users'
          },
          {
            title: 'Total Orders',
            value: allOrders.length,
            tag: 'Tourism',
            tagBg: 'bg-green-100',
            tagText: 'text-green-700',
            chartColor: '#4EE94E',
            icon: 'fa-brands fa-first-order'
          },
          {
            title: label,
            value: this.formatCash(totalCash),
            tag: 'Tourism',
            tagBg: 'bg-green-100',
            tagText: 'text-green-700',
            chartColor: '#4EE94E',
            icon: 'fa-solid fa-money-bill-wave'
          }
        ];
      },
      error: (err) => {
        console.error('❌ Error fetching totals:', err);
      }
    });
  }

  formatCash(amount: number): string {
    if (amount >= 10000000) {
      return `PKR. ${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `PKR. ${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `PKR. ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `PKR. ${amount}`;
    }
  }

parseDate(dateStr: string): Date | null {
  try {
    if (!dateStr) return null;

    if (dateStr.includes('/') && dateStr.split('/').length === 3) {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    // Handle ISO (yyyy-mm-dd) or timestamps
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch (e) {
    console.error('Error parsing date:', dateStr, e);
    return null;
  }
}


  // 🔁 Called when user selects a month
  onMonthChange(): void {
    this.loadData(); // reload with new month filter
  }
}
