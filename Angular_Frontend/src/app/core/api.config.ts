//  ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : 
// Page Name       : API Configuration

// Modify Author   -   Modify Date   -  Reason Of Modify

// Akshay  B       -   02/08/2021    - Configured serviceUrl.
// ==================================================================================================================================\

import { Injectable } from '@angular/core';

@Injectable()
export class ApiConfig {
    public serviceUrl: any;
    constructor() {
                this.serviceUrl = "http://192.168.77.141:45803/";
                // this.serviceUrl = "http://192.168.1.46:45799/";
    }
}