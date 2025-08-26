import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  usersData: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  skeletonArray: number[] = [];
  isloader: boolean = true; //
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.generateSkeletons(7); // Show 5 skeleton rows initially
    this.userdata();
  }
  generateSkeletons(count: number) {
    this.skeletonArray = Array(count).fill(0);
  }
  userdata() {
    this.isloader = true;
    this.generateSkeletons(7);
    this.http
      .get<any>('http://localhost:4000/api/admin', {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.usersData = res.users;
          this.filteredUsers = [...this.usersData];
          this.calculatePagination();
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.isloader = false;
        },
      });
  }

  filterUsers() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = this.usersData.filter((user) =>
      user.email.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.calculatePagination();
  }
}
