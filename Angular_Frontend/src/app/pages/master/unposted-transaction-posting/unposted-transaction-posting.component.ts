// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 13/10/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : master
// Page Name       : unposted-transaction-posting.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay B        -   13/10/2021    - Added getSwitchTypes(), getReconTypes(), getReconModes(),
//                                     getReconFileTypes() methods and related properties.
// Akshay B        -   14/10/2021    - Added showUnpostedTransactions() and
//                                     postTransactions() methods and related properties.
// ================================================================================================================================== 

import { ChangeDetectorRef, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unposted-transaction-posting',
  templateUrl: './unposted-transaction-posting.component.html',
  styleUrls: ['./unposted-transaction-posting.component.scss']
})
export class UnpostedTransactionPostingComponent implements OnInit {
  //#region Common Properties

  @ViewChild('paginator') paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRefs);

  @ViewChild('sort') sort: MatSort = new MatSort();

  @ViewChild('datePicker', { static: true }) datePicker: any;
  uInput: any;
  displayedColumns: any;
  staticDisplayedColumns =
    [
      "ACTION",
      "TRANSACTION_AMOUNT",
      "RRN_NUMBER",
      "STAN_NUMBER",
      "CARD_NO",
      "RESPONSE_CODE",
      "RECON_DET_ID",
      "TRAN_TYPE",
      "TRANSACTION_DATE",
      "ACCOUNT_TYPE",
      "OUR_ACCOUNT_NUMBER",
      "DBCR",
      "TERMINAL_LOCATION",
      "TERMINAL_ID"
    ];

  dummyData = [{
    "RECON_DET_ID": 21,
    "TRAN_TYPE": "O",
    "TRANSACTION_DATE": "2021-08-06",
    "CARD_NO": "6081110100447711",
    "ACCOUNT_TYPE": "10",
    "OUR_ACCOUNT_NUMBER": "101010500024201",
    "STAN_NUMBER": "356521",
    "RRN_NUMBER": "000112004829",
    "TRANSACTION_AMOUNT": 2500.0,
    "DBCR": "DR",
    "TERMINAL_LOCATION": "VISHWA COMPL OMERGA    OMARAGA      MHIN",
    "TERMINAL_ID": "SACWH345",
    "RESPONSE_CODE": "00"
  },
  {
    "RECON_DET_ID": 22,
    "TRAN_TYPE": "O",
    "TRANSACTION_DATE": "2021-08-06",
    "CARD_NO": "6081110100447711",
    "ACCOUNT_TYPE": "10",
    "OUR_ACCOUNT_NUMBER": "101010500024202",
    "STAN_NUMBER": "356522",
    "RRN_NUMBER": "000112004830",
    "TRANSACTION_AMOUNT": 1500.0,
    "DBCR": "DR",
    "TERMINAL_LOCATION": "VISHWA COMPL OMERGA    OMARAGA      MHIN",
    "TERMINAL_ID": "SACWH345",
    "RESPONSE_CODE": "00"
  },
  {
    "RECON_DET_ID": 23,
    "TRAN_TYPE": "O",
    "TRANSACTION_DATE": "2021-08-06",
    "CARD_NO": "6081110100447721",
    "ACCOUNT_TYPE": "10",
    "OUR_ACCOUNT_NUMBER": "101010500024203",
    "STAN_NUMBER": "356523",
    "RRN_NUMBER": "000112004831",
    "TRANSACTION_AMOUNT": 1500.0,
    "DBCR": "DR",
    "TERMINAL_LOCATION": "VISHWA COMPL OMERGA    OMARAGA      MHIN",
    "TERMINAL_ID": "SACWH345",
    "RESPONSE_CODE": "00"
  }];

  dtReconbaseDate: any;
  drpSwitchType: any;
  isPostDisabled: boolean = true;
  switchTypes: any = [];
  filterValue: any;
  tabIndex = 0;
  drpReconcilationFor: any;
  drpReconMode: any;
  drpReconFileType: any;
  reconcilationTypes: any = [];
  reconFileTypes: any = [];
  reconFileTypesTemp: any = [];
  reconModes: any = [];
  intializeReconTypes: boolean = true;
  intializeReconModes: boolean = true;
  intializeReconFileTypes: boolean = true;
  selectedReconDetIds: Array<any> = [];
  isShowDisabled: boolean = true;
  reconcilationMode: string = "";
  repeaterMinHeight: any;
  repeaterCardMinHeight: any;
  isResetDisable: boolean = true;
  showRepeatersDiv: boolean = false;
  checkAll: boolean = false;
  repeaterDataLength: number = 0;

  //#endregion Common Properties


  //#region Table Properties
  showRepeater: boolean = false;
  searchValues: any;
  repeaterData: any = [];
  recondModeName: any;
  repeaterDataTemp: any = [];
  //#endregion Table Properties

  constructor(private changeDetectorRefs: ChangeDetectorRef, private dataService: DataService, private dataStorage: DataStorage) { }

  ngOnInit(): void {
    this.getSwitchTypes();
  }

  ngOnChanges(change: SimpleChanges) {
    this.repeaterData.paginator = this.paginator;
  }

  onPaginateChange(page: any) {
    this.calculateMinHeight();
  }

  calculateMinHeight() {
    this.repeaterMinHeight = 0;
    this.repeaterCardMinHeight = 0;
    var repeater1Height = 0;
    var repeater2Height = 0;
    var repeater3Height = 0;
    var repeater4Height = 0;

    var repeater1Length = 0;
    var repeater2Length = 0;
    var repeater3Length = 0;
    var repeater4Length = 0;

    var repeaterMinHeight = 0;


  }

  selectRecordsToPost(row: any) {

    var length = this.repeaterData.data.length

    for (let index = 0; index < length; index++) {
      if (this.repeaterData.data[index].RECON_DET_ID == row.RECON_DET_ID) {
        this.repeaterData.data[index].ACTION = !this.repeaterData.data[index].ACTION;
      }
    }
    this.minimumRecordSelected();


    var reconDetIdIndex = this.selectedReconDetIds.findIndex(i => i == row.RECON_DET_ID);
    if (reconDetIdIndex == -1) {
      this.selectedReconDetIds.push(row.RECON_DET_ID);
      this.filterValue = row;
    }
    else {
      this.selectedReconDetIds.splice(reconDetIdIndex, 1);
    }

    if (this.selectedReconDetIds.length == 0) {
      this.checkAll = false;
    }

    if (this.selectedReconDetIds.length > 0 && (this.selectedReconDetIds.length == this.repeaterDataLength)) {
      this.checkAll = true;
    }
  }

  filterTable(filterValue: any, control: any, filter?: string, isToggle?: any) {
    switch (control) {
      case "Search": {
        if (filterValue.trim() != "") {
          this.repeaterData.filter = filterValue.trim().toLowerCase();
        }
        else {
          this.repeaterData.filter = null;
        }
        break;
      }
    }
  }

  resetAllProperties() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reset?",
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clearAllProperties();
      } else if (result.isDenied) {
        Swal.fire('You Cancelled', '', 'info');
      }
    });
  }

  clearAllProperties() {
    this.displayedColumns = [];
    this.drpSwitchType = null;
    this.drpReconcilationFor = null;
    this.drpReconMode = null;
    this.drpReconFileType = null;
    this.showRepeater = false;
    this.searchValues = null;
    this.reconcilationTypes = [];
    this.reconModes = [];
    this.reconFileTypes = [];
    this.isPostDisabled = true;
    this.intializeReconTypes = true;
    this.intializeReconModes = true;
    this.intializeReconFileTypes = true;
    this.selectedReconDetIds = [];
    this.isShowDisabled = true;
    this.reconcilationMode = "";
    this.repeaterMinHeight = null;
    this.repeaterCardMinHeight = null;
    this.isResetDisable = true;
    this.showRepeatersDiv = false;
    this.getSwitchTypes();
  }

  getSwitchTypes() {
    this.uInput = {
      keyword: "HELP",
      transaction_key: "VGIPL",
      help_keyword: "GETRECONTYPE",
      help_param: "0",
    }

    try {
      this.dataService.postAtmRecon(this.uInput, this).subscribe(
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

  getReconTypes(switch_id: any) {
    if (this.switchTypes.length > 1 || this.intializeReconTypes) {
      this.isShowDisabled = true;
      this.drpReconcilationFor = null;
      this.reconcilationTypes = [];
      this.drpReconMode = null;
      this.reconModes = []
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      this.uInput = {
        keyword: "HELP",
        transaction_key: "VGIPL",
        help_keyword: "FILEFORMTP",
        help_param: switch_id + "#",
      }

      try {
        this.dataService.postAtmRecon(this.uInput, this).subscribe(
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
        this.uInput = {
          keyword: "HELP",
          transaction_key: "VGIPL",
          // help_keyword: "GETCBSTYPE",
          help_keyword: "RECTPFLG",
          //help_param: "0#",
          help_param: this.drpSwitchType + "#" + recon_type_key,
        }

        try {
          this.dataService.postAtmRecon(this.uInput, this).subscribe(
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

      this.reconModes.forEach((element: any) => {
        if (element.KEY == recon_mode_key) {
          this.recondModeName = element.VALUE;
        }
      });

      if (recon_type_key && recon_mode_key) {
        this.uInput = {
          keyword: "HELP",
          transaction_key: "VGIPL",
          help_keyword: "FILETYPEREC",
          help_param: this.drpSwitchType + "#" + recon_type_key + "#" + recon_mode_key,
        }

        try {
          this.dataService.postAtmRecon(this.uInput, this).subscribe(
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

  postTransactions() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to process?",
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes", denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedReconDetIds.forEach(element => {
          this.uInput = {
            keyword: "ATM_UNPOSTED_TRANSACTION",
            recon_det_id: element,
            cbs_trandate: this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null,
            userid: this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null,
            userdesc: "E1"
          }

          try {
            this.dataService.postAtmRecon(this.uInput, this).subscribe(
              data => {
                if (data.error) {
                  Swal.fire("Error", data.error, "error");
                }
                else {
                  Swal.fire("Post Transaction", "Transaction Posted Successfully", "success");
                  this.showUnpostedTransactions();
                }
              }
            );
          }
          catch (e) {
            Swal.fire("Error", String(e), "error");
          }
        })
      } else if (result.isDenied) {
        Swal.fire('You Cancelled', '', 'info');
      }
    });
  }

  showUnpostedTransactions() {
    this.uInput = {
      keyword: "GET_ATM_UNPOSTED_RECON",
      recon_base_date: this.dtReconbaseDate ? moment(this.dtReconbaseDate).format("YYYY-MM-DD") : null,
      filename_mst_id: this.drpReconFileType,
    }

    try {
      this.dataService.postAtmRecon(this.uInput, this).subscribe(
        data => {
          if (data.error) {
            this.repeaterData = null;
            this.showRepeater = false;
            Swal.fire("Error", data.error, "error");
          }
          else {
            var reconData = JSON.parse(JSON.stringify(data));
            var keys = Object.keys(reconData[0]);
            //this.repeaterDataTemp = JSON.parse(JSON.stringify(reconData.cbs_cursor));
            this.repeaterData = new MatTableDataSource(reconData as any);
            //this.repeaterData.data = this.dummyData;
            this.repeaterDataLength = this.repeaterData.data.length;
            if (this.repeaterDataLength != 0) {
              this.displayedColumns = Object.keys(this.repeaterData.data[0]);
              setTimeout(() => {
                this.repeaterData.sort = this.sort;
                this.repeaterData.paginator = this.paginator;
              });
            }

            if (this.displayedColumns) {
              if (Object.keys(this.displayedColumns).length != 0) {
                if ((Array(this.displayedColumns[0] != "ACTION")[0])) {
                  Array(this.displayedColumns.unshift("ACTION"));
                }
              }
            }

            var length = this.repeaterData.data.length

            for (let index = 0; index < length; index++) {
              this.repeaterData.data[index].ACTION = false;

            }

            if (!this.displayedColumns) {
              this.displayedColumns = this.staticDisplayedColumns;
            }
            this.showRepeatersDiv = true;
            this.showRepeater = true;
          }
        }
      );
    }
    catch (e) {
      console.log(e);
    }


  }

  selectReconFileType() {
    this.isShowDisabled = false;
  }

  EnableReset() {
    if (this.drpSwitchType || this.drpReconFileType || this.drpReconMode || this.drpReconcilationFor) {
      this.isResetDisable = false;
    }
    else {
      this.isResetDisable = true;
    }
  }

  resetRepeatersProperties() {
    this.selectedReconDetIds = [];
    this.showRepeater = false;
    this.repeaterMinHeight = null;
    this.repeaterCardMinHeight = null;
    this.showRepeatersDiv = false;
  }

  checkUncheckAll() {
    var length = this.repeaterData.data.length

    this.checkAll = !this.checkAll;
    for (let index = 0; index < length; index++) {
      if (this.checkAll) {
        this.repeaterData.data[index].ACTION = true;
        this.isPostDisabled = false;
        this.selectedReconDetIds.push(this.repeaterData.data[index].RECON_DET_ID);
      }
      else {
        this.repeaterData.data[index].ACTION = false;
        this.isPostDisabled = true;
        this.selectedReconDetIds = [];
      }
    }

  }

  minimumRecordSelected() {
    var length = this.repeaterData.data.length

    for (let index = 0; index < length; index++) {
      if (this.repeaterData.data[index].ACTION == true) {
        this.isPostDisabled = false;
        break;
      }
      else {
        this.isPostDisabled = true;
      }
    }
  }
}
