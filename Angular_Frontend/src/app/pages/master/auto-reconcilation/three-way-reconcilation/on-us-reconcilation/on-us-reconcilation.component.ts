// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : auto-reconcilation
// Page Name       : on-us-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   03/08/2021    - Added UI releted properties and processOnUsRecon() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-on-us-reconcilation',
  templateUrl: './on-us-reconcilation.component.html',
  styleUrls: ['./on-us-reconcilation.component.scss']
})
export class OnUsReconcilationComponent implements OnInit {

  dtTransactionDate: Date = new Date("");
  dtReconbaseDate: Date = new Date("");

  constructor() { }

  ngOnInit(): void {
  }

  processOnUsRecon() {
    console.log("Transaction Date :" + this.dtTransactionDate);
    console.log("Recon Date :" + this.dtReconbaseDate);
  }

}
