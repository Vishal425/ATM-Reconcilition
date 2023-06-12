import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileFormatConfigurationComponent } from './file-format-configuration/file-format-configuration.component';
import { FileNameConfigComponent } from './file-name-config/file-name-config.component';
import { SwitchMasterComponent } from './switch-master/switch-master.component';
import { UserMasterComponent } from './user-master/user-master.component';
import { CbsFileUploadComponent } from './file-upload/cbs-file-upload/cbs-file-upload.component';
import { NPCIFileUploadComponent } from './file-upload/npcifile-upload/npcifile-upload.component';
import { NtlsFileUploadComponent } from './file-upload/ntls-file-upload/ntls-file-upload.component';
import { PosEcomRefundFileComponent } from './file-upload/pos-ecom-refund-file/pos-ecom-refund-file.component';
import { SwitchFileUploadComponent } from './file-upload/switch-file-upload/switch-file-upload.component';
import { BankMasterComponent } from './bank-master/bank-master.component';
import { MasterComponent } from './master.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AutoReconcilationComponent } from './auto-reconcilation/auto-reconcilation.component';
import { ManualReconcilationComponent } from './manual-reconcilation/manual-reconcilation.component';
import { ReportOneComponent } from './reports/report-one/report-one.component';
import { PdfGenerateComponent } from './pdf-generate/pdf-generate.component';
import { AuthGuard } from 'src/app/auth-guard/auth.guard';
import { MenuCreationComponent } from './menu-creation/menu-creation.component';
import { UnpostedTransactionPostingComponent } from './unposted-transaction-posting/unposted-transaction-posting.component';
import { DataLoadEbankerComponent } from './file-upload/data-load-ebanker/data-load-ebanker.component';
import { BulkDataUploadComponent } from './file-upload/bulk-data-upload/bulk-data-upload.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      // { path: '', redirectTo: '/Home', pathMatch: 'full' },
      { path: 'change-password', canActivate: [AuthGuard], component: ChangePasswordComponent },
      { path: 'Home', canActivate: [AuthGuard], component: DashboardComponent },
      { path: 'File_Format_Design', canActivate: [AuthGuard], component: FileFormatConfigurationComponent },
      { path: 'File_Name_Config', canActivate: [AuthGuard], component: FileNameConfigComponent },
      { path: 'switch-master', canActivate: [AuthGuard], component: SwitchMasterComponent },
      { path: 'User_Creation', canActivate: [AuthGuard], component: UserMasterComponent },
      { path: 'Menu_Creation', canActivate: [AuthGuard], component: MenuCreationComponent },
      { path: 'Bank_Info_Master', canActivate: [AuthGuard], component: BankMasterComponent },
      { path: 'File_Upload', canActivate: [AuthGuard], component: CbsFileUploadComponent },
      { path: 'Bulk_Data_Upload', canActivate: [AuthGuard], component: BulkDataUploadComponent },
      // { path: 'npci-file-upload', canActivate: [AuthGuard], component: NPCIFileUploadComponent },
      // { path: 'ntls-file-upload', canActivate: [AuthGuard], component: NtlsFileUploadComponent },
      { path: 'Pos/Ecom_Refund_File_Posting', canActivate: [AuthGuard], component: PosEcomRefundFileComponent },
      { path: 'Switch_File_Upload', canActivate: [AuthGuard], component: SwitchFileUploadComponent },
      { path: 'Auto_Reconciliation', canActivate: [AuthGuard], component: AutoReconcilationComponent },
      { path: 'Manual_Reconciliation', canActivate: [AuthGuard], component: ManualReconcilationComponent },
      { path: 'Report1', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Recon Match Unmatch Report'} },
      { path: 'pdf', canActivate: [AuthGuard], component: PdfGenerateComponent },
     { path: 'Sponsor_Bank_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Sponsor Bank Report'} },
     { path: 'Rejected_Transaction_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Rejected Transaction Report'} },
      { path: 'Recon_NonRecon_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Recon NonRecon Report'} },
      { path: 'RRN_AllRECORD_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'RRN AllRECORD Report'} },
      { path: 'Ej_Log_Details_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'EJ Log Details Report'} },
     { path: 'Report2', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Report2'} },
     { path: 'Pos/Ecom_Refund_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Pos/Ecom Refund Report'} },
     { path: 'ntls-report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'NTLS Report'} },
     { path: 'Aquiring_Bank_Income_Report', canActivate: [AuthGuard], component: ReportOneComponent,data:{d1:'Aquiring Bank Income Report'} },
     { path: 'unpostedTransactionPosting', canActivate: [AuthGuard], component: UnpostedTransactionPostingComponent },
     { path: 'Data_Load_From_ebanker', canActivate: [AuthGuard], component: DataLoadEbankerComponent },
      { path: '**', redirectTo: '/login', pathMatch:'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
