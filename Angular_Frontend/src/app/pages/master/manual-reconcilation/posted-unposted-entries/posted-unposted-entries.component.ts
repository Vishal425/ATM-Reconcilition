// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 29/07/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : manual-reconcilation
// Page Name       : posted-unposted-entries.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay  B       -   04/08/2021    - Added UI releted properties and processPostedUnpostedEntries() method.
// ================================================================================================================================== 

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posted-unposted-entries',
  templateUrl: './posted-unposted-entries.component.html',
  styleUrls: ['./posted-unposted-entries.component.scss']
})
export class PostedUnpostedEntriesComponent implements OnInit {

  dtReconbaseDate: Date = new Date("");
  lblTotalUnpostedEntries: any = null;
  lblTotalUnpostedAmount: any = null;
  lblSelectedUnpostedEntries: any = null;
  lblSelectedUnpostedAmount: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  processPostedUnpostedEntries() {
    console.log("Recon Date :" + this.dtReconbaseDate);
  }

}
