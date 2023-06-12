// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : auto-reconcilation
// Page Name       : cbs-switch-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   03/08/2021    - Added UI releted properties and processCbsSwitchRecon() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-cbs-switch-reconcilation',
  templateUrl: './cbs-switch-reconcilation.component.html',
  styleUrls: ['./cbs-switch-reconcilation.component.scss']
})
export class CbsSwitchReconcilationComponent implements OnInit {

  dtTransactionDate: Date = new Date("");
  dtReconbaseDate: Date = new Date("");
  drpType: any = null;
  lblLengthOfRecordFiles: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  processCbsSwitchRecon() {
    console.log("Transaction Date :" + this.dtTransactionDate);
    console.log("Recon Date :" + this.dtReconbaseDate);
    console.log("Type Selected :" + this.drpType);
    console.log("length of Record File:" + this.lblLengthOfRecordFiles);
  }
}
