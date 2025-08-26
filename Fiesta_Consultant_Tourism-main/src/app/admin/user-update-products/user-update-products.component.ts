import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-update-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-update-products.component.html',
  styleUrl: './user-update-products.component.css',
})
export class UserUpdateProductsComponent implements OnInit {
  userId: string = '';
  selectedProduct: any = null;

  userobj = {
    Date: '',
    NoofAdult: 0,
    NoofChild: 0,
    Total: 0,
  };

  result: number = 0;
  minDate: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    // Try to get product from navigation or localStorage
    const navState = this.router.getCurrentNavigation()?.extras.state;
    if (navState?.['product']) {
      this.selectedProduct = navState['product'];
      localStorage.setItem(
        'selectedProduct',
        JSON.stringify(this.selectedProduct)
      );
    } else {
      const stored = localStorage.getItem('selectedProduct');
      if (stored) {
        this.selectedProduct = JSON.parse(stored);
      }
    }

    // Fill form if product is found
    if (this.selectedProduct) {
      this.userobj.NoofAdult = this.selectedProduct.adults_no || 0;
      this.userobj.NoofChild = this.selectedProduct.kids_no || 0;
      this.userobj.Total = this.selectedProduct.total || 0;
      this.result = this.userobj.Total;

      // Convert backend date format (e.g. 7/2/2024) to yyyy-mm-dd
      const backendDate = this.selectedProduct.order_date;
      if (backendDate) {
        const parts = backendDate.split('/');
        const formatted = `${parts[2]}-${parts[0].padStart(
          2,
          '0'
        )}-${parts[1].padStart(2, '0')}`;
        this.userobj.Date = formatted;
      }
    }

    // Set today's min date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  onBookNow(): void {
    const rateAdult = this.selectedProduct?.adultBaseprice || 0;
    const rateChild = this.selectedProduct?.kidsBaseprice || 0;

    const adults = Number(this.userobj.NoofAdult) || 0;
    const children = Number(this.userobj.NoofChild) || 0;

    this.result = adults * rateAdult + children * rateChild;
    this.userobj.Total = this.result;
  }

  onsignup(): void {
    if (!this.userobj.Date) {
      alert('Please select a date.');
      return;
    }

    // console.log("📤 Submitted Data:", {
    //   userId: this.userId,
    //   ...this.userobj
    // });

    localStorage.removeItem('selectedProduct');
    alert('✅ Form submitted successfully!');
  }
}
