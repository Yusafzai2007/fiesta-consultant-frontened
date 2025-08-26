import { Component } from '@angular/core';
import { BoxesComponent } from "../boxes/boxes.component";
import { ChartsComponent } from "../charts/charts.component";
import {  OrdersComponent } from "../dashboard-table/dashboard-table.component";
import { UsersComponent } from "../users/users.component";

@Component({
  selector: 'app-all-com',
  standalone: true,
  imports: [BoxesComponent, ChartsComponent, UsersComponent, OrdersComponent],
  templateUrl: './all-com.component.html',
  styleUrl: './all-com.component.css'
})
export class AllComComponent {

}
