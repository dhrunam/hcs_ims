import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FundComponent } from './fund/fund.component';
import { DataTablesModule } from 'angular-datatables';
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';
import { PurchaseItemsComponent } from './purchase-items/purchase-items.component';
import { PurchaseItemReceivedDetailsComponent } from './purchase-item-received-details/purchase-item-received-details.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DispatchDetailsComponent } from './dispatch-details/dispatch-details.component';
import { DispatchItemsComponent } from './dispatch-items/dispatch-items.component';
import { DispatchReceivedAcknowledgementComponent } from './dispatch-received-acknowledgement/dispatch-received-acknowledgement.component';
import { ConsignmentItemsComponent } from './consignment-items/consignment-items.component';
import { ConsignmentItemReceivedDetailsComponent } from './consignment-item-received-details/consignment-item-received-details.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ConsignmentAcknowledgeWorkflowComponent } from './consignment-acknowledge-workflow/consignment-acknowledge-workflow.component';


@NgModule({
  declarations: [
    FundComponent,
    PurchaseDetailsComponent,
    PurchaseItemsComponent,
    PurchaseItemReceivedDetailsComponent,
    DispatchDetailsComponent,
    DispatchItemsComponent,
    DispatchReceivedAcknowledgementComponent,
    ConsignmentItemsComponent,
    ConsignmentItemReceivedDetailsComponent,
    PurchaseComponent,
    ConsignmentAcknowledgeWorkflowComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule,
    AutocompleteLibModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class InventoryModule { }
