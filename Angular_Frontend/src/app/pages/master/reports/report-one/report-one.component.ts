import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import { FileFormatConfigurationComponent } from '../../file-format-configuration/file-format-configuration.component';
const Swal = require('sweetalert2')
declare var require: any

@Component({
  selector: 'app-report-one',
  templateUrl: './report-one.component.html',
  styleUrls: ['./report-one.component.scss']
})
export class ReportOneComponent implements OnInit {
  tabledata: any;
  currDiv: boolean = true;
  rptDiv: boolean = false;
  dtReconbaseDate: any;
  txtFromDate = new Date();
  txtToDate = new Date();
  showPdf: boolean = false;
  sub: any;
  name: any;
  isResetDisable: boolean = true;
  Switch: any;
  SUMMERY_FLAG: any;
  summaryFlag: any;
  ReconFlag: any;
  fileFormat: any;
  fileFormatSelected: any;
  reconfileselected: any;
  drpSwitchType: any
  drpReconcilationFor: any;
  drpReconMode: any;
  drpReconFileType: any;
  reconcilationTypes: any = [];
  reconFileTypes: any = [];
  selectedReconFileType1: any;
  reconFileTypesTemp: any = [];
  reconModes: any = [];
  isShowDisabled: boolean = true;
  reconcilationMode: string = "";
  intializeReconTypes: boolean = true;
  intializeReconModes: boolean = true;
  intializeReconFileTypes: boolean = true;
  switchTypes: any = [];
  rrn_number: any;
  switchFile: any;
  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private dataStorage: DataStorage) { }

  ngOnInit(): void {
    this.sub = this.route.data.subscribe((v: any) => console.log("abc", v))
    console.log("this.sub", this.sub._subscriptions[0].subject._value.d1)
    this.name = this.sub._subscriptions[0].subject._value.d1;
    this.getSwitchTypes();
    let uInput =
    {
      keyword: "HELP",
      transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "GETDETSUMFLG",
      help_param: "0",
      enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
      enter_desc: "E1",
      error: null,
      cursor: null
    }
    try {
      this.dataService.postAtmRecon(uInput, this).subscribe(
        data => {
          this.SUMMERY_FLAG = data;
        });
    }
    catch (e) {
      console.log(e);
    }
    let u1 =
    {
      keyword: "HELP",
      transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "RECTPID",
      help_param: "0",
      enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
      enter_desc: "E1",
      error: null,
      cursor: null
    }
    try {
      this.dataService.postAtmRecon(u1, this).subscribe(
        data => {
          this.switchFile = data;
        });
    }
    catch (e) {
      console.log(e);
    }
    let u2 =
    {
      keyword: "HELP",
      transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "GETRECOFLAG",
      help_param: "0",
      enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
      enter_desc: "E1",
      error: null,
      cursor: null
    }
    try {
      this.dataService.postAtmRecon(u2, this).subscribe(
        data => {
          this.ReconFlag = data;
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  fileFormatCall() {

    let u1 =
    {
      keyword: "HELP",
      transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "FILEFORTYPE",
      help_param: this.Switch + "#",
      enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
      enter_desc: "E1",
      error: null,
      cursor: null
    }
    try {
      this.dataService.postAtmRecon(u1, this).subscribe(
        data => {
          this.fileFormat = data;
        });
    }
    catch (e) {
      console.log(e);
    }
  }


  getReconTypes(switch_id: any) {
    if (this.switchTypes.length > 1 || this.intializeReconTypes) {
      this.isShowDisabled = true;
      this.drpReconcilationFor = null;
      this.reconcilationTypes = [];
      this.drpReconMode = null;
      this.reconModes = []
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      let uInput = {
        keyword: "HELP",
        transaction_key: "VGIPL",
        help_keyword: "FILEFORMTP",
        help_param: switch_id + "#",
      }

      try {
        this.dataService.postAtmRecon(uInput, this).subscribe(
          data => {
            if (data) {
              this.reconcilationTypes = data;
              this.intializeReconTypes = false;
              if (this.reconcilationTypes.length == 1) {
                this.drpReconcilationFor = this.reconcilationTypes[0].KEY;
                this.getReconModes(this.drpReconcilationFor);
              }

            }
            else {
              this.reconcilationTypes = null;
              this.intializeReconTypes = true;
            }
          }
        );
      }
      catch (e) {
        console.log(e);
      }
    }
  }

  getReconModes(recon_type_key: any) {

    if (this.reconcilationTypes.length > 1 || this.intializeReconModes || this.drpReconcilationFor) {
      this.isShowDisabled = true;
      this.drpReconMode = null;
      this.reconModes = []
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      if (recon_type_key) {
        let uInput = {
          keyword: "HELP",
          transaction_key: "VGIPL",
          help_keyword: "GETCBSTYPE",
          help_param: "0#",
        }

        try {
          this.dataService.postAtmRecon(uInput, this).subscribe(
            data => {
              if (data) {
                this.reconModes = data;
                this.intializeReconModes = false;
                if (this.reconModes.length == 1) {
                  this.drpReconMode = this.reconModes[0].RECON_TYPE;
                  this.getReconFileTypes(recon_type_key, this.drpReconMode);
                }
              }
              else {
                this.reconModes = null;
                this.intializeReconModes = true;
              }
            }
          );
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }
  getReconFileTypes(recon_type_key: any, recon_mode_key: any) {
    if (this.reconModes.length > 1 || this.intializeReconFileTypes || this.drpReconMode) {
      this.isShowDisabled = true;
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      if (recon_type_key && recon_mode_key) {
        let uInput = {
          keyword: "HELP",
          transaction_key: "VGIPL",
          help_keyword: "FILETYPEREC",
          help_param: this.drpSwitchType + "#" + recon_type_key + "#" + recon_mode_key,
        }

        try {
          this.dataService.postAtmRecon(uInput, this).subscribe(
            data => {
              if (data) {
                this.reconFileTypes = data;
                this.reconFileTypesTemp = data;
                this.intializeReconFileTypes = false;
              }
              else {
                this.reconFileTypes = null;
                this.intializeReconFileTypes = true;
              }
            }
          );
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }

  getSwitchTypes() {
    let uInput = {
      keyword: "HELP",
      transaction_key: "VGIPL",
      help_keyword: "GETRECONTYPE",
      help_param: "0",
    }

    try {
      this.dataService.postAtmRecon(uInput, this).subscribe(
        data => {
          if (data) {
            this.switchTypes = data;
            if (this.switchTypes.length == 1) {
              this.drpSwitchType = this.switchTypes[0].KEY;
              this.getReconTypes(this.drpSwitchType);
            }
          }
          else {
            this.switchTypes = null;
            this.intializeReconTypes = true;
          }
        }
      );
    }
    catch (e) {
      console.log(e);
    }
  }

  getFileTypesChange(fTypeId: any) {
    console.log('fTypeId : ' + fTypeId);
  }
  // Ej log details

  getEjReconTypes(switch_id: any) {
    if (this.switchTypes.length > 1 || this.intializeReconTypes) {
      this.isShowDisabled = true;
      this.drpReconcilationFor = null;
      this.reconcilationTypes = [];
      this.drpReconMode = null;
      this.reconModes = []
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      let uInput = {
        keyword: "HELP",
        transaction_key: "VGIPL",
        help_keyword: "FILEFORMTP",
        help_param: switch_id + "#",
      }

      try {
        this.dataService.postAtmRecon(uInput, this).subscribe(
          data => {
            if (data) {
              this.reconcilationTypes = data;
              this.intializeReconTypes = false;
              if (this.reconcilationTypes.length == 1) {
                this.drpReconcilationFor = this.reconcilationTypes[0].KEY;
                this.getEjReconModes(this.drpReconcilationFor);
              }

            }
            else {
              this.reconcilationTypes = null;
              this.intializeReconTypes = true;
            }
          }
        );
      }
      catch (e) {
        console.log(e);
      }
    }
  }


  getEjReconModes(recon_type_key: any) {

    if (this.reconcilationTypes.length > 1 || this.intializeReconModes || this.drpReconcilationFor) {
      this.isShowDisabled = true;
      this.drpReconMode = null;
      this.reconModes = []
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      if (recon_type_key) {
        let uInput = {
          keyword: "HELP",
          transaction_key: "VGIPL",
          help_keyword: "RECTPFLG",
          help_param: this.drpSwitchType + recon_type_key
        }

        try {
          this.dataService.postAtmRecon(uInput, this).subscribe(
            data => {
              if (data) {
                this.reconModes = data;
                this.intializeReconModes = false;
                if (this.reconModes.length == 1) {
                  this.drpReconMode = this.reconModes[0].RECON_TYPE;
                  this.getReconFileTypes(recon_type_key, this.drpReconMode);
                }
              }
              else {
                this.reconModes = null;
                this.intializeReconModes = true;
              }
            }
          );
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }

  getReport() {
    this.currDiv = false;
    this.rptDiv = true;
    let uInput;
    console.log("reconreport",this.dataStorage);
    if (this.name == 'Recon NonRecon Report') {
      uInput = {
        keyword: "RECON_NONRECON_REPORT",
        recon_flag: this.reconfileselected,
        file_format_type: this.fileFormatSelected,
        fromdate: moment(this.txtFromDate).format("YYYY-MM-DD"),
        todate: moment(this.txtToDate).format("YYYY-MM-DD"),
        summery_detail_flag: this.summaryFlag,
        recon_type_mst_id: this.Switch,
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "E1"
      }
    }
    else if (this.name == 'RRN AllRECORD Report') {
      uInput = {
        keyword: "RRN_ALLRECORD_REPORT",
        rrn_number: this.rrn_number,
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "E1"
      }
    }
    else if (this.name == 'Rejected Transaction Report') {
      uInput = {
        fromdate: moment(this.txtFromDate).format("YYYY-MM-DD"),
        todate: moment(this.txtToDate).format("YYYY-MM-DD"),
        keyword: "REJECT_TRANSACTION_REPORT",
        filename_mst_id: this.drpReconFileType,
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "E1"
      }
    }
    else if (this.name == 'EJ Log Details Report') {
      uInput = {
        fromdate: moment(this.txtFromDate).format("YYYY-MM-DD"),
        upto_date: moment(this.txtToDate).format("YYYY-MM-DD"),
        trandate: this.dataStorage.loginUserDetails[0].WORKING_DATE,
        keyword: "EJ_LOG_DETAILS",
        filename_mst_id: this.drpReconFileType,
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "E1"
      }
    }
    else {
      uInput = {
        keyword: "RECON_REPORTS",
        recon_type_mst_id: 1,
        trandate: "2021-08-11",
        // fromdate: "2020-08-11",
        // todate: "2021-08-11",
        // txtFromDate
        // txtToDate
        fromdate: moment(this.txtFromDate).format("YYYY-MM-DD"),
        todate: moment(this.txtToDate).format("YYYY-MM-DD"),
        // enter_user_id: 1,
        enter_desc: "e1",
        error: null,
        cursor: null
      }
    }

    this.dataService.postAtmRecon(uInput, this).subscribe(
      data => {
        try {
          if (!data.error) {
            console.log("^^^^^^^^^", data);
            this.tabledata = data;
            console.log("^^^^^^^^^", this.tabledata);

            if (this.tabledata.error == 'No Record Found' || this.tabledata.length <= 0) {
              this.showPdf = false;
              Swal.fire("", "No Record Found", "warning");
              return;
            }
            else {
              // let newArray = JSON.stringify(this.tabledata);
              this.showPdf = true;

              // this.router.navigate([`/pdf`], { queryParams: { 'newArray': newArray, 'a': this.name }, skipLocationChange: true });
            }
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
              });
          }
        }
        catch (e) {
          Swal.fire({
            title: e,
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

  generatePdf() {
    // this.showPdf = true;
    this.showPdf = false;
  }

  EnableReset() {
    if (moment(this.dtReconbaseDate).format("YYYY-MM-DD") != this.dataStorage.loginUserDetails[0].WORKING_DATE
      || this.drpSwitchType || this.drpReconFileType || this.drpReconMode || this.drpReconcilationFor) {
      this.isResetDisable = false;
    }
    else {
      this.isResetDisable = true;
    }
  }
  selectReconFileType() {
    this.isShowDisabled = false;
  }

}
