import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './accounts/login/login.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './accounts/register/register.component';
import { FinancialYearComponent } from './configuration/financial-year/financial-year.component';
import { ItemTypeComponent } from './configuration/item-type/item-type.component';
import { PageNotFoundComponent } from './utilities/page-not-found/page-not-found.component';
import { DashboardComponent } from './public/dashboard/dashboard.component';
import { UnitComponent } from './configuration/unit/unit.component';
import { VendorComponent } from './configuration/vendor/vendor.component';
import { BodyComponent } from './configuration/body/body.component';
import { DesignationComponent } from './configuration/designation/designation.component';
import { ItemMasterComponent } from './configuration/item-master/item-master.component';
import { DistrictComponent } from './configuration/district/district.component';
import { OfficeComponent } from './configuration/office/office.component';
import { LocationComponent } from './configuration/location/location.component';
import { DivisionComponent } from './configuration/division/division.component';
import { AccountheadComponent } from './configuration/accounthead/accounthead.component';
import { FundComponent } from './inventory/fund/fund.component';
import { PurchaseDetailsComponent } from './inventory/purchase-details/purchase-details.component';
import { PurchaseItemsComponent } from './inventory/purchase-items/purchase-items.component';
import { PurchaseItemReceivedDetailsComponent } from './inventory/purchase-item-received-details/purchase-item-received-details.component';
import { DispatchDetailsComponent } from './inventory/dispatch-details/dispatch-details.component';
import { DispatchItemsComponent } from './inventory/dispatch-items/dispatch-items.component';
import { DispatchReceivedAcknowledgementComponent } from './inventory/dispatch-received-acknowledgement/dispatch-received-acknowledgement.component';
import { ConsignmentItemsComponent } from './inventory/consignment-items/consignment-items.component';
import { UserProfileComponent } from './accounts/user-profile/user-profile.component';
import { PurchaseComponent } from './inventory/purchase/purchase.component';
import { ConsignmentAcknowledgeWorkflowComponent } from './inventory/consignment-acknowledge-workflow/consignment-acknowledge-workflow.component';
import { ChartTestComponent } from './public/chart-test/chart-test.component';

import { AuthGuard } from './utilities/guards/auth.guard';
import { RedirectGuard } from './utilities/guards/redirect.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'config/district', component: DistrictComponent, canActivate: [AuthGuard] },
  { path: 'config/designation', component: DesignationComponent, canActivate: [AuthGuard] },
  { path: 'config/body', component: BodyComponent, canActivate: [AuthGuard] },
  { path: 'config/office', component: OfficeComponent, canActivate: [AuthGuard] },
  { path: 'config/division', component: DivisionComponent, canActivate: [AuthGuard] },
  { path: 'config/location', component: LocationComponent, canActivate: [AuthGuard] },
  { path: 'config/unit', component: UnitComponent, canActivate: [AuthGuard] },
  { path: 'config/fy', component: FinancialYearComponent, canActivate: [AuthGuard] },
  { path: 'config/item_type', component: ItemTypeComponent, canActivate: [AuthGuard] },
  { path: 'config/item', component: ItemMasterComponent, canActivate: [AuthGuard] },
  { path: 'config/vendor', component: VendorComponent, canActivate: [AuthGuard] },
  { path: 'config/accounthead', component: AccountheadComponent, canActivate: [AuthGuard] },
  { path: 'inventory/fund', component: FundComponent, canActivate: [AuthGuard] },
  { path: 'inventory/purchase_details', component: PurchaseDetailsComponent, canActivate: [AuthGuard] },
  { path: 'inventory/items/purchase', component: PurchaseItemsComponent, canActivate: [AuthGuard] },
  { path: 'inventory/item/purchase/receive', component: PurchaseItemReceivedDetailsComponent, canActivate: [AuthGuard] },
  // {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'inventory/dispatch_details', component: DispatchDetailsComponent, canActivate: [AuthGuard] },
  { path: 'inventory/item/dispatch', component: DispatchItemsComponent, canActivate: [AuthGuard] },
  { path: 'inventory/dispatch/acknowledge', component: DispatchReceivedAcknowledgementComponent, canActivate: [AuthGuard] },
  { path: 'inventory/consignment/items', component: ConsignmentItemsComponent, canActivate: [AuthGuard] },
  { path: 'inventory/purchase', component: PurchaseComponent, canActivate: [AuthGuard] },
  { path: 'inventory/consignment/ack/workflow', component: ConsignmentAcknowledgeWorkflowComponent, canActivate: [AuthGuard] },

  { path: "user/reg", component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'chart', component: ChartTestComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
