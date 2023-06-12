// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : manual-reconcilation
// Page Name       : cbs-npci-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   04/08/2021    - Added UI releted properties and processManualCbsNpciRecon() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cbs-npci-reconcilation',
  templateUrl: './cbs-npci-reconcilation.component.html',
  styleUrls: ['./cbs-npci-reconcilation.component.scss']
})
export class CbsNpciReconcilationComponent implements OnInit {

  dtTransactionDate: Date = new Date("");
  dtReconbaseDate: Date = new Date("");
  drpType: any = null;
  lblLengthOfRecordFiles: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  processManualCbsNpciRecon() {
    console.log("Transaction Date :" + this.dtTransactionDate);
    console.log("Recon Date :" + this.dtReconbaseDate);
    console.log("Type Selected :" + this.drpType);
    console.log("length of Record File:" + this.lblLengthOfRecordFiles);
  }

}
