import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountsModule } from './accounts/accounts.module';
import { CoreModule } from './core/core.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { HttpClientModule } from '@angular/common/http';
import { UtilitiesModule } from './utilities/utilities.module';
import { SharedModule } from './shared/shared.module';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { InventoryModule } from './inventory/inventory.module';
import { errorInterceptorProviders } from './helpers/error.interceptor';

// import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,

    // RegisterComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    UtilitiesModule,
    HttpClientModule,
    AccountsModule,
    ConfigurationModule,
    SharedModule,
    InventoryModule

  ],
  providers: [authInterceptorProviders, errorInterceptorProviders],
  bootstrap: [AppComponent],

})
export class AppModule { }
