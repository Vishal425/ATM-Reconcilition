import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { FileFormatConfigurationComponent } from './file-format-configuration/file-format-configuration.component';
import { FileNameConfigComponent } from './file-name-config/file-name-config.component';
import { SwitchMasterComponent } from './switch-master/switch-master.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { NtlsFileUploadComponent } from './file-upload/ntls-file-upload/ntls-file-upload.component';
import { PosEcomRefundFileComponent } from './file-upload/pos-ecom-refund-file/pos-ecom-refund-file.component';
import { NPCIFileUploadComponent } from './file-upload/npcifile-upload/npcifile-upload.component';
import { SwitchFileUploadComponent } from './file-upload/switch-file-upload/switch-file-upload.component';
import { CbsFileUploadComponent } from './file-upload/cbs-file-upload/cbs-file-upload.component';
import { MaterialModule } from 'src/app/material/material.module';
import { BankMasterComponent } from './bank-master/bank-master.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MasterComponent } from './master.component';
import { FormsModule } from '@angular/forms';
import { AutoReconcilationComponent } from './auto-reconcilation/auto-reconcilation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManualReconcilationComponent } from './manual-reconcilation/manual-reconcilation.component';
import { ReportOneComponent } from './reports/report-one/report-one.component';
import { PdfGenerateComponent } from './pdf-generate/pdf-generate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnpostedTransactionPostingComponent } from './unposted-transaction-posting/unposted-transaction-posting.component';
import { DataLoadEbankerComponent } from './file-upload/data-load-ebanker/data-load-ebanker.component';
import { BulkDataUploadComponent } from './file-upload/bulk-data-upload/bulk-data-upload.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    FileFormatConfigurationComponent,
    SwitchMasterComponent,
    FileNameConfigComponent,
    UserMasterComponent,
    BankMasterComponent,
    CbsFileUploadComponent,
    SwitchFileUploadComponent,
    NPCIFileUploadComponent,
    PosEcomRefundFileComponent,
    NtlsFileUploadComponent,
    MasterComponent,
    AutoReconcilationComponent,
    ManualReconcilationComponent,
    ReportOneComponent,
    PdfGenerateComponent,
    DashboardComponent,
    UnpostedTransactionPostingComponent,
    DataLoadEbankerComponent,
    BulkDataUploadComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MasterRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule
  ]
})
export class MasterModule { }
