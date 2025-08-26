import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CitydetailsComponent } from './citydetails/citydetails.component';
import { NavTourComponent } from './nav-tour/nav-tour.component';
import { NavAboutusComponent } from './nav-aboutus/nav-aboutus.component';
import { ReasonBookComponent } from './reason-book/reason-book.component';
import { ProducttableComponent } from './producttable/producttable.component';
import { LoginComponent } from './login/login.component';
import { SinupComponent } from './sinup/sinup.component';
import { InvalidComponent } from './invalid/invalid.component';
import { AdminComponent } from './admin/admin.component';
import { CorporateComponent } from './corporate/corporate.component';
import { LocalGuideComponent } from './local-guide/local-guide.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarLayoutComponent } from './admin/sidebar-layout/sidebar-layout.component';
import { AllComComponent } from './admin/all-com/all-com.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';
import { CardsDetilsComponent } from './admin/cards-detils/cards-detils.component';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { ProductsComponent } from './admin/products/products.component';
import { EditComponent } from './admin/edit/edit.component';
import { UsersComponent } from './admin/users/users.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { CardsComponent } from './cards/cards.component';
import { authGuard } from './guards/auth.guard'; // ✅ path ko sahi adjust karo
import { UserUpdateProductsComponent } from './admin/user-update-products/user-update-products.component';
import { AuthGuard } from './auth.guard';

// Make sure this is 'export const routes'
export const routes: Routes = [
{
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'products/:id', component: ProductDetailComponent,canActivate:[authGuard] },
      { path: 'city', component: CitydetailsComponent
 },
      { path: 'card', component: CardsComponent 
},
      { path: 'login', component: LoginComponent },
      { path: 'invalid', component: InvalidComponent },
      { path: 'sinup', component: SinupComponent },
      { path: 'main', component: MainComponent },
      { path: 'citytour', component: NavTourComponent },
      { path: 'aboutus', component: NavAboutusComponent },
      { path: 'invalid', component: InvalidComponent },
      { path: 'corporate', component: CorporateComponent },
      { path: 'local', component: LocalGuideComponent },
      { path: 'Product_details', component: ReasonBookComponent },
      { path: 'producttable', component: ProducttableComponent },
    ]
  },


{
  path: 'admin',
  component: SidebarLayoutComponent,
  canActivate: [AuthGuard], 
  children: [
    { path: '', component: AllComComponent,canActivate: [AuthGuard], },
    
    { path: 'Users', component: UsersComponent,canActivate: [AuthGuard], },
    { path: 'Orders', component: OrdersComponent,canActivate: [AuthGuard], },
    { path: 'Add-Products', component: AddProductsComponent,canActivate: [AuthGuard], },
    { path: 'products', component: ProductsComponent,canActivate: [AuthGuard], },
    { path: 'edit/:id', component: EditComponent,canActivate: [AuthGuard], },
    { path: 'user-details/:userId', component: UserDetailsComponent,canActivate: [AuthGuard], },
    { path: 'user-Order-details/:userId', component: UserUpdateProductsComponent,canActivate: [AuthGuard], },
    { path: 'carddetails/:userId', component: CardsDetilsComponent,canActivate: [AuthGuard], }
  ]
}




];
