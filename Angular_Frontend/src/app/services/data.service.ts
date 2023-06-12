//  ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : 
// Page Name       : Data service

// Modify Author   -   Modify Date   -  Reason Of Modify

// Akshay  B       -   19/01/2021    - Added setNewUserInfo(), getNewUserInfo(), postAtmRecon(), 
//                                      getAtmRecon(), checkDevice(), checkLogin() methods and related properties.
// Akshay  B       -   04/08/2021    - Added registerDevice() method.
// ==================================================================================================================================

import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { ICore } from "../interface/core";
// import { DataStorage } from '../core/dataStorage';
import { BehaviorSubject, Subject } from 'rxjs';
// import { Observable , Subject} from 'rxjs';
@Injectable()
export class DataService {
    errorMsg = {
        title: 'Info',
        msg: '',
        showClose: true,
        timeout: 10000,
        theme: 'bootstrap',
        type: 'info',
        position: 'top-right',
        closeOther: true
    }
    // With this subject you can save the sidenav state and consumed later into other pages.
    public sideNavState$: Subject<boolean> = new Subject();

    public constructor(private apiService: ApiService) {
    }

    private newUser = new BehaviorSubject<any>({
        show_menu_screen_flag: 'C',
    });

    selectedInput: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    setNewUserInfo(user: any) {
        this.newUser.next(user);
    }

    getNewUserInfo() {
        return this.newUser.asObservable();
    }

    postAtmRecon(uInput: any, page: any) {
        return this.apiService.sendToServer<ICore>('', uInput, page);
    }

    getAtmRecon(params: any) {
        return this.apiService.getFromServer('', params)
    }

    checkDevice(uInput: any, page: any) {
        return this.apiService.checkDevice<ICore>('/checkDevice', uInput, page);
    }

    checkLogin(uInput: any, page: any) {
        return this.apiService.checkLogin<ICore>('/login', uInput, page);
    }
    // changePassword(uInput: any, page: any) {
    //     return this.apiService.changePassword<ICore>('change-password', uInput, page);
    // }
    registerDevice(uInput: any, page: any) {
        return this.apiService.registerDevice<ICore>('/registerDevice', uInput, page);
    }
}
