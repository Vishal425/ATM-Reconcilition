// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : manual-reconcilation
// Page Name       : issuer-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   04/08/2021    - Added UI releted properties and processManualIssuerRecon() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issuer-reconcilation',
  templateUrl: './issuer-reconcilation.component.html',
  styleUrls: ['./issuer-reconcilation.component.scss']
})
export class IssuerReconcilationComponent implements OnInit {


  dtTransactionDate: Date = new Date("");
  dtReconbaseDate: Date = new Date("");

  constructor() { }

  ngOnInit(): void {
  }

  processManualIssuerRecon() {
    console.log("Transaction Date :" + this.dtTransactionDate);
    console.log("Recon Date :" + this.dtReconbaseDate);
  }
  
}
