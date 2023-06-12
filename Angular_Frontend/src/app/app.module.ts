import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/user/login/login.component';
import { MasterModule } from './pages/master/master.module';
import { DataService } from './services/data.service';
import { ApiService } from './core/api.service';
import { DataStorage } from './core/dataStorage';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ForgetPasswordComponent } from './pages/user/forget-password/forget-password.component';
import { ChangePasswordComponent } from './pages/master/change-password/change-password.component';
import { ApiConfig } from './core/api.config';
import { SharedModule } from './shared/shared.module';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { AuthService } from './services/auth.service';
import { DatePipe } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
// import { DashboardTwoComponent } from './dashboardTwo/dashboardTwo.component';
@NgModule({
  declarations: [
    AppComponent,
    // DashboardComponent,
    LoginComponent,
    ForgetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MasterModule,
    HttpClientModule,
    FormsModule,
    BackButtonDisableModule.forRoot({preserveScrollPosition: true}),
    SharedModule,
    NgIdleKeepaliveModule.forRoot(),
  ],
  providers: [DataService, ApiService, DataStorage, ApiConfig, AuthService,DatePipe],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
})
export class AppModule { }
