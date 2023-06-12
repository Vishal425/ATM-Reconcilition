//  ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : 
// Page Name       : ICore

// Modify Author    -   Modify Date   -  Reason Of Modify

// Akshay  B        -   19/01/2021    - Added common properties.
// ==================================================================================================================================

export interface ICore {
    message: string;
    STATUS: string;
    data: Array<any>;
    result: any;
    cursor: any;
    device_id: any;
    error: any;
}
