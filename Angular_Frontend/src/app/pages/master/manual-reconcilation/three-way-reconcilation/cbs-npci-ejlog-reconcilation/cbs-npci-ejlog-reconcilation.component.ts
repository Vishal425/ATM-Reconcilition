// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : manual-reconcilation
// Page Name       : cbs-switch-ejlog-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   04/08/2021    - Added UI releted properties and processManualCbsNpciEjLogRecon() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cbs-npci-ejlog-reconcilation',
  templateUrl: './cbs-npci-ejlog-reconcilation.component.html',
  styleUrls: ['./cbs-npci-ejlog-reconcilation.component.scss']
})
export class CbsNpciEjlogReconcilationComponent implements OnInit {

  dtTransactionDate: Date = new Date("");
  dtReconbaseDate: Date = new Date("");
  drpType: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  processManualCbsNpciEjLogRecon() {
    console.log("Transaction Date :" + this.dtTransactionDate);
    console.log("Recon Date :" + this.dtReconbaseDate);
    console.log("Type Selected :" + this.drpType);
  }

}
