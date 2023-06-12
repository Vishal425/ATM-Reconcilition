// ===========================================================================================================
// Original Author : Vishal Lote
// Creation Date   : 16/05/2023
// Project Name    : ATM RECONCILATION
// Module Name	   : App
// Page Name       : change-password.ts

// Modify Author   -   Modify Date   -  Reason Of Modify
// Vishal Lote       -   18/05/2023    - 

// ================================================================================================================================== 
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  txtUserCode = ''
  txtPassword: any;
  newpasswd: any;
  txtPassword2: any;
  user_id: any;
  title = '';
  message: any;
  lblUserCode: any = "User Code";
  drpLoginType: any = "U";
  devideId: any;
  txtUserType: string = "";
  CaptChaModelValue = '';
  CaptchaBox: any;
  mainCaptcha: any;
  date = new Date().toLocaleDateString('en-CA');
  userId: any;
  constructor(private dataService: DataService, private router: Router, private dataStorage: DataStorage, private dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

  checkLogin(){
    this.router.navigate(['/Home'])
    return true
  }



  
  submitPassword(){
    console.log("changepwds",this.dataStorage.loginUserDetails[0]);
    var uInput = {
      keyword: "CHANGE_PASSWORD",
      device_type: "W",
      // device_id: this.devideId,
      device_id: 1,
      user_id:1,
      transaction_time: moment(new Date()).format("HH:mm"),
      transaction_date: moment(new Date().toLocaleDateString()).format("DD-MMM-YYYY"),
      request_from: "CBS",
      app_mode: "ATM",
      txtPassword: this.txtPassword,
      newpasswd: this.newpasswd,
      txtPassword2:this.newpasswd
    };

    if (this.txtPassword == undefined  ) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please enter the password',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else if (this.txtPassword != this.dataStorage.loginUserDetails[0].CURRENT_PASSWORD ) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please enter the correct password',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else if (this.newpasswd != this.txtPassword2) {
      Swal.fire({
        title: 'Warning!',
        text: 'Password not matched',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else{
      Swal.fire({
        title: 'Success',
        text: 'Password Change succesfully',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      this.dataService.postAtmRecon(uInput, this).subscribe(
        (data: any) => {
        console.log('changepwd',data); 
      this.dataStorage.loginUserDetails = data;
    }
    );
      this.router.navigate(['/login'])
      return true;
    }

  }
  
  onPaste() {
    return false;
  }
  
  checkPassword() {
    var capitalLetter = 0;
    var number = 0;
    var specialCharacters = 0;
    var smallCaseLetter = 0;

    if (this.txtPassword.length >= 8) {
      for (var i = 0; i < this.txtPassword.length; i++) {
        if (Number(String(this.txtPassword).charCodeAt(i)) >= 65 && Number(String(this.txtPassword).charCodeAt(i)) <= 90) {
          capitalLetter++;
        }
        if (Number(String(this.txtPassword).charCodeAt(i)) >= 97 && Number(String(this.txtPassword).charCodeAt(i)) <= 122) {
          smallCaseLetter++;
        }
        if (Number(String(this.txtPassword).charCodeAt(i)) >= 48 && Number(String(this.txtPassword).charCodeAt(i)) <= 57) {
          number++;
        }
        if ((Number(String(this.txtPassword).charCodeAt(i)) >= 33 && Number(String(this.txtPassword).charCodeAt(i)) <= 47) ||
          (Number(String(this.txtPassword).charCodeAt(i)) >= 58 && Number(String(this.txtPassword).charCodeAt(i)) <= 64) ||
          (Number(String(this.txtPassword).charCodeAt(i)) >= 91 && Number(String(this.txtPassword).charCodeAt(i)) <= 96) ||
          (Number(String(this.txtPassword).charCodeAt(i)) >= 123 && Number(String(this.txtPassword).charCodeAt(i)) <= 126)) {
          specialCharacters++;
        }
      }

      if (capitalLetter < 1 || smallCaseLetter < 1 || number < 1 || specialCharacters < 1) {
        Swal.fire('Warning', "Password should contain atleast one capital letter, one small letter, number and a special character", 'info');
      }
    }
    else{
      Swal.fire('Warning', "Password Length - Minimum 8 Characters", 'info');
    }
  }

  
}
