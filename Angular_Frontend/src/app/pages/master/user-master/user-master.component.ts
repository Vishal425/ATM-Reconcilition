import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
//import * as CryptoJS from 'crypto-js';

export interface User {
  USER_NAME: string;
  USER_CODE: string;
  USER_SHORT_NAME: string;
  USER_TYPE_DESC: string;
  LOGIN_NAME: string;
}

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.scss']
})
export class UserMasterComponent implements OnInit {
  txtUserId: any;
  txtUserName: any;
  chkStatus: boolean = true;
  txtLoginName: any;
  txtUserShortName: any;
  txtUserNameOL: any;
  txtCurrPass: any;
  txtShortPass: any;
  pageMode: string = 'N';
  disableSubmitBtn: boolean = false;
  pageType: string = 'Addition';
  txtOperationFlag: any;
  currentHide = true;
  shortHide = true;
  viewRepeater: boolean = false;
  showData: any;
  submitBtn: boolean = false;
  tempUsers: any = [];
  tempUsersLevel: any = [];
  drpUserType: any;
  drpUserLevel: any;
  text = 'submit';
  displayedColumns: string[] = ['USER_NAME', 'USER_CODE' , 'USER_SHORT_NAME', 'USER_TYPE_DESC', 'LOGIN_NAME', 'actions'];
  public dataSource: any = [];
  @ViewChild('userName', { static: true }) userName: any;
  hideCurr = true;
  hideShort = true;
  // tokenFromUI: string = "secretkey123";
  // encrypted: any = "";
  // decrypted: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getUserType();
    this.getUserLevel();
    this.userName.nativeElement.focus();
    // this.Clear();
    // console.log("txtLoginName",this.txtLoginName)
    // console.log("txtLoginName",this.txtCurrPass)

  }

  saveUserMaster(element?: any) {
    if (this.pageMode == 'N') {
      this.txtUserId = 0;
    }

    let uInput: any;
    if (element == 'show') {
      uInput = {
        keyword: "HELP",
        transaction_date: "2021-08-05",
        transaction_time: null,
        request_from: "SYS",
        app_mode: "SYS",
        transaction_key: "VGIPL",
        help_keyword: "GETUSER",
        help_param: "0",
        enter_user_id: 1,
        enter_desc: "E1",
        error: null,
        cursor: null
      }
    }

    else if (this.pageMode == 'N' || this.pageMode == 'M' || this.pageMode == 'V') {
     // this.encryptUsingAES256();
     // this.decrytUsingAES256();
      uInput = {
        keyword: "USER_MASTER",
        opflag: this.pageMode,
        request_from: "CBS",
        app_mode: "SYS",
        transaction_date: "2021-08-06",
        transaction_time: null,
        appli_from_date: "2021-08-06",
        // transaction_key: "VGIPL",
        userid: this.txtUserId,
        user_code: null,
        user_type: this.drpUserType,
        user_short_name: this.txtUserShortName,
        user_short_name_ol: "",
        login_name: this.txtLoginName,
        user_level_mst_id: this.drpUserLevel,
        current_password: this.txtCurrPass,
        current_pwd_slt: "1",
        short_password: this.txtShortPass,
        short_pwd_slt: "1",
        mpin: "1",
        mpin_slt: "2",
        tpin: "1",
        tpin_slt: "1",
        user_language_id: 1,
        pass_change_date: "2021-08-06",
        pin_change_date: "2021-08-06",
        creation_date: "2021-08-06",
        expiry_date: "2021-08-06",
        status: this.chkStatus ? 'Y' : 'N',
        status_from_date: "2021-08-06",
        status_upto_date: "2021-08-06",
        user_inact_reason: "",
        first_login_attemp: 1,
        enter_user_id: 1,
        enter_desc: "",
        error: null,
        cursor: null
      };
    }
    //  return;
    if (element != 'show' && element !== 'hide' && (this.pageMode == 'N' || this.pageMode == 'M') && (!this.txtUserName || !this.txtUserShortName || !this.drpUserType || !this.txtLoginName)) {
      Swal.fire("", "Please enter compulsary fields", "warning");
      return;
    }
    if ((this.pageMode == 'N' || this.pageMode == 'M') && element !== 'show' && element !== 'hide') {
      let msgData = this.pageMode == 'N' ? 'submit' : null;
      if (this.pageMode == 'M') {
        this.text = 'modify';
      }
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to " + this.text + " data?",
        icon: 'question',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiCalling(uInput, element);
        } else if (result.isDenied) {
          return;
        }
      })
    } else {
      this.apiCalling(uInput, element);
    }
  }


  // ========== API Call for N,M,D,R method==============================

  apiCalling(uInput: any, element: any) {
    try {
      this.disableSubmitBtn = true;
      this.dataService.postAtmRecon(uInput, element).subscribe(
        (data: any) => {
          this.disableSubmitBtn = false;
          let message = null;
          console.log('>>>', data);
          try {
            if (!data.error) {
              console.log("data", data)
              console.log("element", element)

              let message = null;

              if (this.pageMode == 'N' && element !== 'show' && element !== 'hide') {
                Swal.fire("Added successfully")
                this.Clear();
                this.saveUserMaster('show');
              } else if (this.pageMode == 'M' && element !== 'show' && element !== 'hide') {
                Swal.fire("updated successfully")
                this.Clear();
                this.saveUserMaster('show');

              } else if (this.pageMode == 'V' && element == 'edit') {
                // console.log("##", data.cursor[0]);
                this.txtUserId = data.USERID;
                this.txtUserName = data.LOGIN_NAME;
                // this.txtUserNameOL = data.USER_SHORT_NAME_OL;
                this.txtUserShortName = data.USER_SHORT_NAME;
                this.drpUserType = data.USER_TYPE;
                console.log("!!", this.drpUserType);
                this.drpUserLevel = data.USER_LEVEL_MST_ID;
                this.chkStatus = data.STATUS;
                this.txtLoginName = data.LOGIN_NAME;
                // this.txtCurrPass = data.CURRENT_PASSWORD;
                this.txtCurrPass = data.CURRENT_PASSWORD;
                this.txtShortPass = data.SHORT_PASSWORD;
                this.pageMode = 'M';
              }



              if (element == 'show') {
                //  this.showData = data;
                this.dataSource = data;
                this.viewRepeater = true;
                console.log("showData", this.showData)
              }
              //   else if (element == 'hide') {
              //    this.viewRepeater = false;
              //  } 


            }
            else {
              Swal.fire({
                title: 'Error',
                icon: 'error',
                confirmButtonText: "OK",
              })
                .then((result: any) => {
                  if (result.isConfirmed) {
                    this.submitBtn = false;
                  }
  
                })
            }
          }
          catch (e) {
            Swal.fire({
             // title: e,
              icon: 'error',
              confirmButtonText: "OK",
            })
              .then((result: any) => {
                if (result.isConfirmed) {
                  this.submitBtn = false;
                }

              })
          }
        })
      if (element == 'hide') {
        this.viewRepeater = false;
      }
    }
    catch (e) {
      Swal.fire(this.pageType, "something went wrong", "error");
    }
  }


  Clear() {
    this.txtUserId = null;
    this.txtUserName = null;
    this.txtUserNameOL = null;
    this.txtUserShortName = null;
    this.txtLoginName = null;
    this.drpUserType = null;
    // this.chkStatus = false;
    this.drpUserLevel = null;
    this.txtCurrPass = null;
    this.txtShortPass = null;
  }

  getUserType(param?: any) {
    console.log(param);
    let uInput = {
      keyword: "HELP",
      transaction_date: "2021-08-05",
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "USERTYPE",
      help_param: "0",
      enter_user_id: 1,
      enter_desc: "E1",
      error: null,
      cursor: null
    };
    try {
      console.log(uInput);
      this.dataService.postAtmRecon(uInput, this).subscribe(
        (data: any) => {
          if (!data.error) {
            this.tempUsers = data;
            // this.dataSource = data;
          }
          else {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              confirmButtonText: "OK",
            })
              .then((result: any) => {
                if (result.isConfirmed) {
                  this.submitBtn = false;
                }

              })
          }
        }
      );
    } catch (e) {
      Swal.fire(this.pageType, "something went wrong", "error");
    }
  }


  getUserLevel() {
    let uInput = {
      keyword: "HELP",
      transaction_date: "2021-08-05",
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "USEELVLID",
      help_param: "0",
      enter_user_id: 1,
      enter_desc: "E1",
      error: null,
      cursor: null
    };
    try {
      console.log(uInput);
      this.dataService.postAtmRecon(uInput, this).subscribe(
        data => {
          if (!data.error) {
            this.tempUsersLevel = data;
          }
          else {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              confirmButtonText: "OK",
            })
              .then((result: any) => {
                if (result.isConfirmed) {
                  this.submitBtn = false;
                }

              })
          }
        }
      );
    } catch (e) {
      Swal.fire(this.pageType, "something went wrong", "error");
    }
  }

  bindValue(element: any) {
    this.pageMode = "V";
    console.log("V", element)
    this.txtUserId = element.PK;
    this.saveUserMaster('edit');
  }

  

//   encryptUsingAES256() {
//     try {
//       var encryptedData = CryptoJS.AES.encrypt(this.txtCurrPass, this.tokenFromUI);
//       this.encrypted = encryptedData.toString();
//       console.log(this.encrypted);
//       return this.encrypted;
//     }
//     catch (e) {
//       console.log(e);
//     }
//   }

  // decrytUsingAES256() {
  //   try {
  //     var decryptedData = CryptoJS.AES.decrypt(this.txtCurrPass, this.tokenFromUI);
  //     this.decrypted = decryptedData.toString();
  //     console.log(this.decrypted);
  //     return this.decrypted;
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }
}
