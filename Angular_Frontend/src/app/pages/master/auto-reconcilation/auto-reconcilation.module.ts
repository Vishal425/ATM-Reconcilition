import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoReconcilationRoutingModule } from './auto-reconcilation-routing.module';
import { CbsSwitchReconcilationComponent } from './two-way-reconcilation/cbs-switch-reconcilation/cbs-switch-reconcilation.component';
import { CbsNpciReconcilationComponent } from './two-way-reconcilation/cbs-npci-reconcilation/cbs-npci-reconcilation.component';
import { CbsSwitchNpciReconcilationComponent } from './three-way-reconcilation/cbs-switch-npci-reconcilation/cbs-switch-npci-reconcilation.component';
import { CbsNpciEjlogReconcilationComponent } from './three-way-reconcilation/cbs-npci-ejlog-reconcilation/cbs-npci-ejlog-reconcilation.component';
import { OnUsReconcilationComponent } from './three-way-reconcilation/on-us-reconcilation/on-us-reconcilation.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CbsSwitchReconcilationComponent,
    CbsNpciReconcilationComponent,
    CbsSwitchNpciReconcilationComponent,
    CbsNpciEjlogReconcilationComponent,
    OnUsReconcilationComponent
  ],
  imports: [
    CommonModule,
    AutoReconcilationRoutingModule,
    FormsModule
  ]
})
export class AutoReconcilationModule { }
