// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : auto-reconcilation
// Page Name       : cbs-switch-npci-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   03/08/2021    - Added UI releted properties and processCbsSwitchNpciRecon() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cbs-switch-npci-reconcilation',
  templateUrl: './cbs-switch-npci-reconcilation.component.html',
  styleUrls: ['./cbs-switch-npci-reconcilation.component.scss']
})
export class CbsSwitchNpciReconcilationComponent implements OnInit {

  dtTransactionDate: Date = new Date("");
  dtReconbaseDate: Date = new Date("");
  drpType: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  processCbsSwitchNpciRecon() {
    console.log("Transaction Date :" + this.dtTransactionDate);
    console.log("Recon Date :" + this.dtReconbaseDate);
    console.log("Type Selected :" + this.drpType);
  }
}
