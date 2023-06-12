import { Injectable } from '@angular/core';
import { DataStorage } from '../core/dataStorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private dataStorage: DataStorage) { }
  getUserId() {
    let userId = '';
    if(this.dataStorage.loginUserDetails && this.dataStorage.loginUserDetails.length > 0 && this.dataStorage.loginUserDetails[0].USERID){
      userId = this.dataStorage.loginUserDetails[0].USERID
    }
    if (userId) {
      return userId;
    } else {
      return false
    }
  }
}
