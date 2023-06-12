//  ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : 
// Page Name       : API service

// Modify Author   -   Modify Date   -  Reason Of Modify

// Akshay  B       -   02/08/2021    - Added sendToServer(), getFromServer(), checkDevice() and checkLogin()
//                                      methods.
// Akshay  B       -   04/08/2021    - Added registerDevice() method.
// ==================================================================================================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfig } from './api.config';
import { DataStorage } from './dataStorage';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private apiConfig: ApiConfig, private dataStorage: DataStorage) {

  }

  sendToServer<interfaceType>(path: string, obj: any, page: any) {
    if (this.dataStorage.loginUserDetails != undefined) {

      if (this.dataStorage.sessionValue) {
        obj.longitude = this.dataStorage.sessionValue.coords.longitude;
        obj.latitude = this.dataStorage.sessionValue.coords.latitude;
        obj.accuracy = this.dataStorage.sessionValue.coords.accuracy;
      }
      else {
        obj.longitude = '111';
        obj.latitude = '111';
        obj.accuracy = '111';
      }
      obj.app_mode = "SYS";
      obj.request_from = "CBS";
      obj.transaction_date = obj.transaction_date ? obj.transaction_date : this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
      obj.transaction_time = new Date().toLocaleTimeString();
      if (obj.pass_user_id) {
        obj.pass_user_id = obj.pass_user_id ? obj.pass_user_id : null;
      }
      else {
        obj.enter_user_id = this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null;
      }
      obj.enter_desc = null;
    }

    return this.http.post<interfaceType>(this.apiConfig.serviceUrl + path, obj);
  }

  getFromServer(path: string, queryParams: any) {
    return this.http.get(this.apiConfig.serviceUrl + path, { params: queryParams });
  }

  checkDevice<interfaceType>(path: string, obj: any, page: any) {
    if (this.dataStorage.loginUserDetails != undefined) {
      if (this.dataStorage.sessionValue) {
        obj.longitude = this.dataStorage.sessionValue.coords.longitude;
        obj.latitude = this.dataStorage.sessionValue.coords.latitude;
        obj.accuracy = this.dataStorage.sessionValue.coords.accuracy;
      }
      else {
        obj.longitude = '111';
        obj.latitude = '111';
        obj.accuracy = '111';
      }
      obj.app_mode = "SYS";
      obj.request_from = "CBS";
      obj.transaction_date = obj.transaction_date ? obj.transaction_date : this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
      obj.transaction_time = new Date().toLocaleTimeString();
      if (obj.pass_user_id) {
        obj.pass_user_id = obj.pass_user_id ? obj.pass_user_id : null;
      }
      else {
        obj.enter_user_id = this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : 1;
      }
      obj.enter_desc = null;
    }
    return this.http.post<interfaceType>(this.apiConfig.serviceUrl + path, obj);
  }

  checkLogin<interfaceType>(path: string, obj: any, page: any) {
    if (this.dataStorage.loginUserDetails != undefined) {
      if (this.dataStorage.sessionValue) {
        obj.longitude = this.dataStorage.sessionValue.coords.longitude;
        obj.latitude = this.dataStorage.sessionValue.coords.latitude;
        obj.accuracy = this.dataStorage.sessionValue.coords.accuracy;
      }
      else {
        obj.longitude = '111';
        obj.latitude = '111';
        obj.accuracy = '111';
      }
      obj.app_mode = "SYS";
      obj.request_from = "CBS";
      obj.transaction_date = obj.transaction_date ? obj.transaction_date : this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
      obj.transaction_time = new Date().toLocaleTimeString();
      if (obj.pass_user_id) {
        obj.pass_user_id = obj.pass_user_id ? obj.pass_user_id : null;
      }
      else {
        obj.enter_user_id = this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null;
      }
      obj.enter_desc = null;
    }
    return this.http.post<interfaceType>(this.apiConfig.serviceUrl + path, obj);
  }
  // changePassword<interfaceType>(path: string, obj: any, page: any) {
  //   if (this.dataStorage.loginUserDetails != undefined) {
  //     if (this.dataStorage.sessionValue) {
  //       obj.longitude = this.dataStorage.sessionValue.coords.longitude;
  //       obj.latitude = this.dataStorage.sessionValue.coords.latitude;
  //       obj.accuracy = this.dataStorage.sessionValue.coords.accuracy;
  //     }
  //     else {
  //       obj.longitude = '111';
  //       obj.latitude = '111';
  //       obj.accuracy = '111';
  //     }
  //     obj.app_mode = "SYS";
  //     obj.request_from = "CBS";
  //     obj.transaction_date = obj.transaction_date ? obj.transaction_date : this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
  //     obj.transaction_time = new Date().toLocaleTimeString();
  //     if (obj.pass_user_id) {
  //       obj.pass_user_id = obj.pass_user_id ? obj.pass_user_id : null;
  //     }
  //     else {
  //       obj.enter_user_id = this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null;
  //     }
  //     obj.enter_desc = null;
  //   }
  //   return this.http.post<interfaceType>(this.apiConfig.serviceUrl + path, obj);
  // }
  registerDevice<interfaceType>(path: string, obj: any, page: any) {
    if (this.dataStorage.loginUserDetails != undefined) {
      obj.app_mode = "SYS";
      obj.request_from = "CBS";
      obj.transaction_date = obj.transaction_date ? obj.transaction_date : this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
      obj.transaction_time = new Date().toLocaleTimeString();
      if (obj.pass_user_id) {
        obj.pass_user_id = obj.pass_user_id ? obj.pass_user_id : null;
      }
      else {
        obj.enter_user_id = this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null;
      }
      obj.enter_desc = null;
    }
    return this.http.post<interfaceType>(this.apiConfig.serviceUrl + path, obj);
  }
}