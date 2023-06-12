// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : App
// Page Name       : Login.ts

// Modify Author   -   Modify Date   -  Reason Of Modify
// Akshay  B       -   29/07/2021    - Added checkDevice(), checkLogin() methods and related properties.
// Akshay  B       -   04/08/2021    - Added registerDevice() method.
// ================================================================================================================================== 

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login1.component.scss']
})
export class LoginComponent {
  title = '';
  message: any;
  lblUserCode: any = "User Code";
  drpLoginType: any = "U";
  txtUserCode: any;
  txtPassword: any;
  devideId: any;
  txtUserType: string = "";
  CaptChaModelValue = '';
  CaptchaBox: any;
  mainCaptcha: any;
  date = new Date().toLocaleDateString('en-CA');
  userId: any;
  constructor(private dataService: DataService, private router: Router, private dataStorage: DataStorage, private dialog: MatDialog) {

  }


  public ngOnInit(): void {
    // this.registerDevice();
    this.Captcha();
  }

  Captcha() {
    var alpha = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
    var i, a, b, c, d;
    for (i = 0; i < 4; i++) {
      a = alpha[Math.floor(Math.random() * alpha.length)];
      b = alpha[Math.floor(Math.random() * alpha.length)];
      c = alpha[Math.floor(Math.random() * alpha.length)];
      d = alpha[Math.floor(Math.random() * alpha.length)];
      // var e = alpha[Math.floor(Math.random() * alpha.length)];
      // var f = alpha[Math.floor(Math.random() * alpha.length)];
    }
    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d;
    // var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f;
    this.mainCaptcha = code;
    var colors = ["#B40404", "#beb1dd", "#b200ff", "#faff00", "#0000FF", "#FE2E9A", "#FF0080", "#2EFE2E",];
    var rand = Math.floor(Math.random() * colors.length);
    //$('#mainCaptcha').css("background-color", colors[rand]);

  }
  onPaste() {
    return false;
  }

  checkDevice() {

    var uInput = {
      keyword: "CHECK_DEVICE",
      device_type: "W",
      mac_device_id: "08606E6A5757,00000000000000E9",
      mac_device_name: "VGCBS-26.vginfo.net",
      machin_ip_add: "192.168.1.141",
      device_id: 0,

    };

    this.dataService.checkDevice(uInput, this).subscribe(
      (data: any) => {
        if (data) {
          console.log(data);
          this.devideId = data[0].DEVICE_ID;
          return true;
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: "error",
            icon: 'error',
            confirmButtonText: 'OK'
          })
          return false;
        }
      }
    );
  }


  removeSpaces(string: any) {
    return string.split(' ').join('');
  }

  checkLogin() {
    if (this.txtUserCode == undefined || this.txtUserCode == '') {
      Swal.fire({
        title: 'Warning!',
        text: 'Please Enter User Code',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else if (this.txtPassword == undefined || this.txtPassword == '') {
      Swal.fire({
        title: 'Warning!',
        text: 'Please Enter Password',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }
    else if (this.CaptChaModelValue == "" && this.CaptChaModelValue.trim().length == 0) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please Enter Captcha',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }
    var string1 = this.removeSpaces(this.mainCaptcha);
    var string2 = this.removeSpaces(this.CaptChaModelValue);
    this.removeSpaces(this.mainCaptcha)
    if (string1 != string2 || string2 == "") {
      this.Captcha();
      Swal.fire({
        title: 'Warning!',
        text: 'Please Entered Valid Captcha',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      this.CaptChaModelValue = '';
      return false;
    }
    var uInput = {
      keyword: "CHECK_LOGIN",
      device_type: "W",
      // device_id: this.devideId,
      device_id: 1,
      transaction_time: moment(new Date()).format("HH:mm"),
      transaction_date: moment(new Date().toLocaleDateString()).format("DD-MMM-YYYY"),
      user_type: "E",
      login_type: "U",
      login_code: this.txtUserCode,
      login_pass: this.txtPassword,
      // mac_device_id: "08606E6A5757,00000000000000E0",
      // mac_device_name: "VGCBS-22.vginfo.net",
      // machin_ip_add: "192.168.1.245",
    };

    this.dataService.checkLogin(uInput, this).subscribe(
      (data: any) => {
        var status = data[0] ? data[0].STATUS ? data[0].STATUS : "" : "";
        if (status == "N") {
          this.dataStorage.loginUserDetails = data;
          this.router.navigate(['/Home'])
          return true;
        }
        if (data[0].error) {
          console.log(data);
          // this.txtUserCode='';
          // this.CaptChaModelValue = '';
          // this.txtPassword='';
          this.Captcha();
          if (data[0].error == "User is Already Login To ") {
            Swal.fire({
              title: 'Error!',
              text: data[0].error,
              icon: 'error',
              confirmButtonText: 'Do You Want Forcefully logoff!!'
            }).then((result: any) => {
              if (result.isConfirmed) {
                this.checkUser();
              } else if (result.isDenied) {
                return;
              }
            })
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: data[0].error,
              icon: 'error',
              confirmButtonText: 'OK'
            })
            return false;
          }
        }
        return false;
      }
    );
    return false;
  }

  checkUser() {
    let uInput = {
      keyword: "PASSWORD_CHECK",
      user_code: this.txtUserCode,
      password: this.txtPassword
    }
    this.dataService.postAtmRecon(uInput, this).subscribe(
      (data: any) => {
        if (data.user_id == 1) {
          this.userId = data.user_id;
          this.logOff();
        }
        else {
          Swal.fire({
            title: data.error,
            icon: 'error',
            confirmButtonText: "OK",
          })
            .then((result: any) => {
              if (result.isConfirmed) {
                return;
              }
            })
        }
      });
  }

  logOff() {
    console.log("this.userId", this.userId)
    let uInput = {
      keyword: "LOGOUT",
      transaction_key: "VGIPL",
      request_from: "CBS",
      app_mode: "ATM",
      user_id: this.userId,
      logout_data: null,
      transaction_time: "",
      error: null,
      transaction_date: this.date,
      cursor: null,
      message: null
    }
    this.dataService.postAtmRecon(uInput, 'logout').subscribe(
      (data: any) => {

        if (!data.error) {
          this.txtUserCode = '';
          this.CaptChaModelValue = '';
          this.txtPassword = '';
        }
        else if (data.error) {
          Swal.fire({
            title: data.error,
            icon: 'error',
            confirmButtonText: "OK",
          })
            .then((result: any) => {
              if (result.isConfirmed) {
                return;
              }

            })
        }
      });
  }

  registerDevice() {
    var uInput = {
      keyword: "REGISTER_DEVICE",
      opflag: "N",
      op_br_mst_id: 2,
      appli_from_date: null,
      transaction_key: "VGIPL",
      device_details: null,
      pio_reg_dev_det_id: null,
      device_type: "W",
      mac_device_id: "08606E6A5757,00000000000000E9",
      mac_device_name: "VGCBS-26.vginfo.net",
      machin_ip_add: "192.168.1.141",
      check_ip_flag: "Y"
    };

    this.dataService.registerDevice(uInput, this).subscribe(
      (data: any) => {
        if (data.error) {
          Swal.fire({
            title: 'Error!',
            text: data.error,
            icon: 'error',
            confirmButtonText: 'OK'
          })
          return false;
        }
        else {
          var stringData = JSON.stringify(data);
          var parsedData = JSON.parse(stringData);
          this.checkDevice();
          console.log(parsedData.Reg_Dev_Det_Id);
          return true;
        }
      }
    );
  }

  forgetPassword() {
    this.router.navigate(['/forget-password'])
    return true
  }

  changePassword(){
    this.router.navigate(['/change-password'])
    return true
  }

  checkUserName(){
    if (this.txtUserCode.length < 7) {
      Swal.fire('Warning', "Username Length - Minimum 6 Characters", 'info');
    }
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
