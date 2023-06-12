import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/user/login/login.component';
import { ForgetPasswordComponent } from './pages/user/forget-password/forget-password.component';
import { ChangePasswordComponent } from './pages/master/change-password/change-password.component';
import { MasterComponent } from './pages/master/master.component';
// import { DashboardTwoComponent } from './dashboardTwo/dashboardTwo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: "master", component: MasterComponent },
  {path: "forget-password" , component:ForgetPasswordComponent},
  {path: "change-password" , component:ChangePasswordComponent},
  // {path: '**', redirectTo: '/login', pathMatch:'full'}
  // { path: "dashboardTwo", component: DashboardTwoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
