import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CbsSwitchReconcilationComponent } from './two-way-reconcilation/cbs-switch-reconcilation/cbs-switch-reconcilation.component';
import { CbsNpciReconcilationComponent } from './two-way-reconcilation/cbs-npci-reconcilation/cbs-npci-reconcilation.component';
import { CbsSwitchNpciReconcilationComponent } from './three-way-reconcilation/cbs-switch-npci-reconcilation/cbs-switch-npci-reconcilation.component';
import { CbsNpciEjlogReconcilationComponent } from './three-way-reconcilation/cbs-npci-ejlog-reconcilation/cbs-npci-ejlog-reconcilation.component';
import { OnUsReconcilationComponent } from './three-way-reconcilation/on-us-reconcilation/on-us-reconcilation.component';
import { IssuerReconcilationComponent } from './three-way-reconcilation/issuer-reconcilation/issuer-reconcilation.component';
import { PostedUnpostedEntriesComponent } from './posted-unposted-entries/posted-unposted-entries.component';

const routes: Routes = [
  { path: 'manual-cbs-switch-reconcilation', component: CbsSwitchReconcilationComponent },
  { path: 'manual-cbs-npci-reconcilation', component: CbsNpciReconcilationComponent },
  { path: 'manual-cbs-switch-npci-reconcilation', component: CbsSwitchNpciReconcilationComponent },
  { path: 'manual-cbs-npci-ejlog-reconcilation', component: CbsNpciEjlogReconcilationComponent },
  { path: 'manual-on-us-reconcilation', component: OnUsReconcilationComponent },
  { path: 'manual-issuer-reconcilation', component: IssuerReconcilationComponent },
  { path: 'posted-unposted-entries', component: PostedUnpostedEntriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualReconcilationRoutingModule { }
