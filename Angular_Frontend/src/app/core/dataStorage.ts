//  ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : 
// Name            : DataStorage 

// Modify Author     -   Modify Date   -  Reason Of Modify

// Akshay  B         -   02/08/2021    - Added properties to store session data.
// Akshay  B         -   02/08/2021    - changed login user type name and data type to login user details and any.

// ==================================================================================================================================
import { Injectable } from '@angular/core';
import { Time } from '@angular/common';

@Injectable()
export class DataStorage {
    public data: any;
    /**
     * get and set login user type
     */
    private _loginUserDetails: any
    get loginUserDetails(): any {
        return this._loginUserDetails;
    }
    set loginUserDetails(value) {
        this._loginUserDetails = value;
    }
    /**
     * get and set login user info
     */
    private _logInfo: any;
    get logInfo(): any {
        return this._logInfo;
    }
    set logInfo(value) {
        this._logInfo = value;
    }

    private _sessionValue: any;
    get sessionValue(): any {
        return this._sessionValue;
    }
    set sessionValue(value) {
        this._sessionValue = value;
    }

    private _childMenuInfo: any;
    get childMenuInfo(): any {
        return this._childMenuInfo;
    }
    
    set childMenuInfo(value) {
        this._childMenuInfo = value;
    }

    private _shortMenu: any;
    get shortMenu(): any {
        return this._shortMenu;
    }
    
    set shortMenu(value) {
        this._shortMenu = value;
    }

    private _userRemainder: any;
    get userRemainder(): any {
        return this._userRemainder;
    }
    
    set userRemainder(value) {
        this._userRemainder = value;
    }



    private _matMenuPosXY: any;
    get matMenuPosXY(): any {
        return this._matMenuPosXY;
    }
    set matMenuPosXY(value) {
        this._matMenuPosXY = value;
    }

    public constructor() {

    }
}

