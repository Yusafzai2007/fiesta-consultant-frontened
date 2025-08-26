import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductService } from '../adminservice/add-product.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  userId: string = '';
  userOrders: any[] = [];
  filteredOrders: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  selectedProduct: any = null;
  userName: string = '';
  address: string = '';
  selectedOrder: any = null;
  searchQuery: string = '';

  // Delete confirmation variables
  showDeleteConfirmation: boolean = false;
  orderToDelete: string = '';
  productToDelete: string = '';

  // Edit variables
  editingProduct: any = null;
  showEditLoader: boolean = false;
  orderToEdit: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private addservice: AddProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') || '';
      if (this.userId) {
        this.getUserOrders();
      } else {
        this.error = 'No user ID provided';
      }
    });
  }

getUserOrders() {
  this.isLoading = true;
  this.error = null;

  this.http
    .get<any>(
      `http://localhost:4000/api/userordersdetails?userId=${this.userId}`,
      { withCredentials: true }
    )
    .subscribe({
      next: (res) => {
        this.userOrders = (res.orders || [])
          .sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .map((order: any) => {
            const orderCreatedAt = order.createdAt ? new Date(order.createdAt) : null;
            order.products.forEach((product: any) => {
              product.createdAt = orderCreatedAt;
            });
            return order;
          });

        this.filteredOrders = [...this.userOrders];

        if (this.userOrders.length > 0) {
          this.userName = this.userOrders[0].userName || '';
        } else {
          this.error = 'No orders found for this user';
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load orders';
        this.isLoading = false;
      },
    });
}
dateQuery: string = '';
filterProducts() {
  if (!this.searchQuery && !this.dateQuery) {
    this.filteredOrders = [...this.userOrders];
    return;
  }

  const titleQuery = this.searchQuery.toLowerCase();
  const dateQuery = this.dateQuery;

  this.filteredOrders = this.userOrders
    .map((order) => {
      const filteredProducts = order.products.filter((product: any) => {
        const matchesTitle = titleQuery ? 
          product.producttitle.toLowerCase().includes(titleQuery) : 
          true;
        
        // Convert both dates to same format for comparison
        let matchesDate = true;
        if (dateQuery) {
          const dbDateParts = product.order_date?.split('/');
          const dbDateFormatted = dbDateParts?.reverse().join('-'); // Convert DD/MM/YYYY to YYYY-MM-DD
          matchesDate = dbDateFormatted === dateQuery;
        }

        return matchesTitle && matchesDate;
      });
      return { ...order, products: filteredProducts };
    })
    .filter((order) => order.products.length > 0);
}

  onTransferTypeChange() {
    if (this.editingProduct.transfertype === 'Private') {
      this.editingProduct.privateAdult = this.editingProduct.privateAdult || 1;
      this.editingProduct.privateChild = this.editingProduct.privateChild || 0;
      this.editingProduct.privatetransferprice =
        this.editingProduct.privatetransferprice || 0;
    } else {
      this.editingProduct.adults_no = this.editingProduct.adults_no || 1;
      this.editingProduct.kids_no = this.editingProduct.kids_no || 0;
      this.editingProduct.total = this.editingProduct.total || 0;
    }
  }

  calculateTotal(order: any): number {
    return order.products.reduce(
      (sum: number, product: any) => sum + (product.total || 0),
      0
    );
  }

  capitalizeFirstLetter(name: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  openModal(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  openPaymentModal(order: any) {
    this.selectedOrder = order;
  }

  closeModalpayment() {
    this.selectedOrder = null;
  }

  deleteProduct(orderId: string, productId: string) {
    this.orderToDelete = orderId;
    this.productToDelete = productId;
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    this.showDeleteConfirmation = false;
    this.addservice
      .deleteProductorder(this.orderToDelete, this.productToDelete)
      .subscribe({
        next: () => {
          // Step 1: remove the product locally (optional)
          const orderIndex = this.userOrders.findIndex(
            (order) => order._id === this.orderToDelete
          );
          if (orderIndex > -1) {
            const productIndex = this.userOrders[orderIndex].products.findIndex(
              (p: any) => p._id === this.productToDelete
            );
            if (productIndex > -1) {
              this.userOrders[orderIndex].products.splice(productIndex, 1);
            }

            // Step 2: agar is order ke products empty ho gaye
            if (this.userOrders[orderIndex].products.length === 0) {
              this.userOrders.splice(orderIndex, 1);
            }
          }

          // Step 3: agar sare orders hi khatam ho gaye
          if (this.userOrders.length === 0) {
            alert('Last product deleted. Redirecting to all orders.');
            this.router.navigate(['/admin/Orders']);
          } else {
            // Agar kuch orders bache hain to refresh karo
            this.getUserOrders();
          }
        },
        error: (err) => {
          console.error('❌ Failed to delete product:', err);
        },
      });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.orderToDelete = '';
    this.productToDelete = '';
  }

  recalculateSharedTotal(product: any) {
    const adultCount = Number(product.adults_no) || 0;
    const childCount = Number(product.kids_no) || 0;

    const rateAdult = product.adultBaseprice || 0;
    const rateChild = product.kidsBaseprice || 0;
    const discountPercentage = product.discountPercentage || 0;
    const maxQuantity = Number(product.quantity) || 0;

    const totalPeople = adultCount + childCount;

    if (maxQuantity && totalPeople > maxQuantity) {
      product.quantityError = `❌ Only ${maxQuantity} people allowed. You selected ${totalPeople}.`;
    } else {
      product.quantityError = '';
    }

    const totalAdult = adultCount * rateAdult;
    const totalChild = childCount * rateChild;
    const total = totalAdult + totalChild;

    const discount = (total * discountPercentage) / 100;
    const finalTotal = total - discount;

    product.total = Math.round(finalTotal);
  }

  closeEditModal() {
    this.editingProduct = null;
  }

  // When editing a product
  onEdit(orderId: string, product: any) {
    this.editingProduct = { ...product };
    this.orderToEdit = orderId; // Make sure this is the correct order ID
    // console.log('Editing:', {
    //   orderId: this.orderToEdit,
    //   productId: this.editingProduct._id
    // });
  }

  saveEdit() {
    if (!this.orderToEdit || !this.editingProduct?._id) {
      console.error('Missing IDs:', {
        orderId: this.orderToEdit,
        productId: this.editingProduct?._id,
      });
      return;
    }

    // ✅ Format order_date
    const rawDate = this.editingProduct.order_date;
    let formattedDate = rawDate;
    if (rawDate && rawDate.includes('/')) {
      const parts = rawDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    // ✅ Build payload
    const updatedData: any = {
      transfertype: this.editingProduct.transfertype,
      order_date: formattedDate,
    };

    if (this.editingProduct.transfertype === 'Private') {
      // Set Private fields
      updatedData.privateAdult = this.editingProduct.privateAdult || 0;
      updatedData.privateChild = this.editingProduct.privateChild || 0;
      updatedData.privatetransferprice =
        this.editingProduct.privatetransferprice || 0;

      // Force reset Shared fields
      updatedData.adults_no = 0;
      updatedData.kids_no = 0;
      updatedData.total = 0; // total not used for private, but you can reset it too
    } else {
      // Set Shared fields
      updatedData.adults_no = this.editingProduct.adults_no || 0;
      updatedData.kids_no = this.editingProduct.kids_no || 0;
      updatedData.total = this.editingProduct.total || 0;

      // Force reset Private fields
      updatedData.privateAdult = 0;
      updatedData.privateChild = 0;
      updatedData.privatetransferprice = 0;
    }

    this.showEditLoader = true;

    this.addservice
      .updateOrderProduct(
        this.orderToEdit,
        this.editingProduct._id,
        updatedData
      )
      .subscribe({
        next: () => {
          alert('✅ Product updated successfully!');
          this.getUserOrders();
          this.editingProduct = null;
          this.showEditLoader = false;
        },
        error: (err) => {
          console.error('❌ Error while updating product:', err);
          alert('Failed to update product.');
          this.showEditLoader = false;
        },
      });
  }

  resetSearch() {
  this.searchQuery = '';
  this.dateQuery = '';
  this.filterProducts();
}
}
