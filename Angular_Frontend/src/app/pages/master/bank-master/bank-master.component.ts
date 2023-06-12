import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  styleUrls: ['./bank-master.component.scss']
})
export class BankMasterComponent implements OnInit {
  txtBankId: any;
  txtBankName: any;
  txtAddress: any;
  drpBankType: any;
  txtBankShortName: any;
  txtBankNameOL: any;
  pageMode: string = 'N';
  disableSubmitBtn: boolean = false;
  pageType: string = 'Addition';
  txtOperationFlag: any;
  viewRepeater: boolean = false;
  showData: any;
  submitBtn: boolean = false;
  tempBanks: any = [];
  text = 'submit';
  dummyLogo: string = "../../../assets/images/dummyBankLogo.png";
  base64ImagePath = this.dummyLogo;
  editImg: boolean = true;
  removeImg: boolean = false;
  zoomImg: boolean = false;
  isImageSaved: boolean = true;
  isZoomIn: boolean = true;
  isZoomOut: boolean = false;
  isAddMode: boolean = true;
  isModifyMode: boolean = false;
  isReadOnly: boolean = false;
  convertedBase64String: string | undefined;
  imageName: any;
  txtBankLogo: any;
  displayedColumns: string[] = ['BANK_NAME', 'BANK_SHORT_NAME', 'actions'];
  public dataSource: any = [];
  @ViewChild('bankName', { static: true }) bankName: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getBankType();
    this.bankName.nativeElement.focus();
  }

  saveBankMaster(element?: any) {
    if (this.pageMode == 'N') {
      this.txtBankId = null;
    }

    let uInput: any;
    if (element == 'show') {
      uInput = {
        keyword: "HELP",
        transaction_date: "2021-08-05",
        transaction_time: "",
        request_from: "SYS",
        app_mode: "SYS",
        transaction_key: "VGIPL",
        help_keyword: "GETBANKINFO",
        help_param: "0",
        enter_user_id: 1,
        enter_desc: "E1",
        error: null,
        cursor: null
      }

    }

    else if (this.pageMode == 'N' || this.pageMode == 'M' || this.pageMode == 'V') {
      uInput = {
        keyword: "BANK_INFO",
        opflag: this.pageMode,
        transaction_date: "2021-08-03",
        request_from: "CBS",
        transaction_time: null,
        app_mode: "ATM",
        transaction_key: "VGIPL",
        bank_mst_id: this.txtBankId,
        bank_code: "",
        bank_name: this.txtBankName,
        bank_name_ol: '',
        address_1: this.txtAddress,
        bank_type: this.drpBankType,
        bank_short_name: this.txtBankShortName,
        bank_establishment_date: "2021-08-07",
        cbs_start_date: "2021-08-07",
        bank_logo: this.txtBankLogo ? this.txtBankLogo : null,
        total_branches: 1,
        online_branches: 1,
        total_onsite_atm: 1,
        total_offsite_atm: 1,
        pan: "",
        tan: "",
        rbi_regi_code: "",
        gst_no: "",
        bank_rbi_grade: "",
        clg_bank_code: 8,
        micr_code: "",
        bank_bsr_code: 5,
        ifsc_code: null,
        eft_code: null,
        ecs_code: null,
        enter_user_id: 1,
        enter_desc: null,
        error: null,
        cursor: null
      };
    }

    if (element != 'show' && element !== 'hide' && (this.pageMode == 'N' || this.pageMode == 'M') && (!this.txtBankName || !this.txtAddress || !this.drpBankType || !this.txtBankShortName)) {
      Swal.fire("", "Please enter compulsary fields", "warning");
      return;
    }

    if ((this.pageMode == 'N' || this.pageMode == 'M') && element != 'show' && element !== 'hide') {
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
          try {
            if (!data.error) {
              console.log("data", data)
              console.log("element", element)

              let message = null;

              if (this.pageMode == 'N' && element !== 'show' && element !== 'hide') {
                Swal.fire("Added successfully")
                this.Clear();
                this.saveBankMaster('show');
              } else if (this.pageMode == 'M' && element !== 'show' && element !== 'hide') {
                Swal.fire("updated successfully")
                this.Clear();
                this.saveBankMaster('show');
              } else if (this.pageMode == 'V' && element == 'edit') {
                this.txtBankId = data.BANK_MST_ID;
                this.txtBankName = data.BANK_NAME;
                this.txtBankNameOL = data.BANK_NAME_OL;
                this.txtAddress = data.ADDRESS_1;
                this.drpBankType = data.BANK_TYPE;
                console.log("!!", this.drpBankType);
                this.txtBankShortName = data.BANK_SHORT_NAME;
                this.txtBankLogo = data.BANK_LOGO;
                this.base64ImagePath = data.BANK_LOGO ? 'data:image/png;base64,' + data.BANK_LOGO : this.dummyLogo;
                this.pageMode = 'M';
              }



              if (element == 'show') {
                this.dataSource = data;
                // this.showData = data;
                this.viewRepeater = true;

                console.log("showData", this.showData)

              }


            }
            else {
              Swal.fire({
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
    this.txtBankId = null;
    this.txtBankName = null;
    this.txtBankNameOL = null;
    this.txtAddress = null;
    this.drpBankType = null;
    this.txtBankShortName = null;
    this.base64ImagePath = this.dummyLogo;
    this.txtBankLogo = null;
  }

  getBankType(param?: any) {
    console.log(param);
    let uInput = {
      keyword: "HELP",
      transaction_date: "2021-08-05",
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "BANKTYPE",
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
            this.tempBanks = data;
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

  bindValue(data: any) {
    this.pageMode = "V";
    console.log("V", data)
    this.txtBankId = data.BANK_MST_ID;
    this.saveBankMaster('edit');
  }

  removeImage() {
    if (this.isAddMode || this.isModifyMode) {
      this.base64ImagePath = this.dummyLogo;
      this.isImageSaved = false;
      this.editImg = true;
      this.removeImg = false;
      this.zoomImg = false;
    }
  }
  zoomImage() {
    //   if (this.base64ImagePath != this.dummyLogo)
    //     this.modalService.open(modal);
  }

  convertToBase64(evt: any) {
    var files = evt.target.files;
    var file = files[0];
    this.imageName = file.name;
    if (files && file) {
      var reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }
  handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.txtBankLogo = btoa(binaryString);
    this.getImageFromBase64(this.txtBankLogo);
  }
  getImageFromBase64(base64String: any) {
    if (base64String) {
      this.base64ImagePath = 'data:image/png;base64,' + base64String;
      this.editImg = false;
      this.removeImg = true;
      this.zoomImg = true;
    }
    else {
      console.log("please enter valid base64 string to connvert");
    }
  }


}



//BANKTYPE --0 PARAM
