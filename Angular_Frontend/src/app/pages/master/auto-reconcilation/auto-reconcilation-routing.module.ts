import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CbsSwitchReconcilationComponent } from './two-way-reconcilation/cbs-switch-reconcilation/cbs-switch-reconcilation.component';
import { CbsNpciReconcilationComponent } from './two-way-reconcilation/cbs-npci-reconcilation/cbs-npci-reconcilation.component';
import { CbsSwitchNpciReconcilationComponent } from './three-way-reconcilation/cbs-switch-npci-reconcilation/cbs-switch-npci-reconcilation.component';
import { CbsNpciEjlogReconcilationComponent } from './three-way-reconcilation/cbs-npci-ejlog-reconcilation/cbs-npci-ejlog-reconcilation.component';
import { OnUsReconcilationComponent } from './three-way-reconcilation/on-us-reconcilation/on-us-reconcilation.component';

const routes: Routes = [
  { path: 'cbs-switch-reconcilation', component: CbsSwitchReconcilationComponent },
  { path: 'cbs-npci-reconcilation', component: CbsNpciReconcilationComponent },
  { path: 'cbs-switch-npci-reconcilation', component: CbsSwitchNpciReconcilationComponent },
  { path: 'cbs-npci-ejlog-reconcilation', component: CbsNpciEjlogReconcilationComponent },
  { path: 'on-us-reconcilation', component: OnUsReconcilationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoReconcilationRoutingModule { }
