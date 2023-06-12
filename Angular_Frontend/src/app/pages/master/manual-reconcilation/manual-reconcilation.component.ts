// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 09/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : master
// Page Name       : manual-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay B        -   10/08/2021    - Added getSwitchTypes(), getReconTypes(), getReconModes(),
//                                     getReconFileTypes(), showReconcilationData() methods and related properties.
// Akshay B        -   11/08/2021    - Added processManualReconcilation() method and related properties.
// Akshay B        -   14/08/2021    - Added clearAllProperties() Method.
// Akshay B        -   21/08/2021    - Added pagination for all repeaters.
// ================================================================================================================================== 

import { Component, OnInit, ViewChild, SimpleChanges, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manual-reconcilation',
  templateUrl: './manual-reconcilation.component.html',
  styleUrls: ['./manual-reconcilation.component.scss']
})
export class ManualReconcilationComponent implements OnInit {

  //#region Common Properties

  @ViewChild('paginator1') paginator1: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRefs);
  @ViewChild('paginator2') paginator2: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRefs);
  @ViewChild('paginator3') paginator3: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRefs);
  @ViewChild('paginator4') paginator4: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRefs);

  @ViewChild('sort1') sort1: MatSort = new MatSort();
  @ViewChild('sort2') sort2: MatSort = new MatSort();
  @ViewChild('sort3') sort3: MatSort = new MatSort();
  @ViewChild('sort4') sort4: MatSort = new MatSort();
  @ViewChild('datePicker', { static: true }) datePicker: any;
  uInput: any;
  displayedColumns: any;
  staticDisplayedColumns =
    [
      "ACTION",
      "TRANSACTION_AMOUNT",
      "ACTUAL_AMOUNT",
      "RRN_NUMBER",
      "STAN_NUMBER",
      "CARD_NO",
      "RESPONSE_CODE",
      "MTI",
      "ATM_TRAN_DATE",
      "ATM_TRAN_TIME",
      "TRANSACTION_FEE",
      "CASHBACK_AMOUNT",
      "RECON_DET_ID"
    ];

  dtTransactionDate: any = new Date();
  dtReconbaseDate: any;
  drpSwitchType: any;
  processFlag: string = "";
  isProcessDisabled: boolean = true;
  switchTypes: any = [];
  filterValue: any;
  reconcilationHeading: string = "Manual Reconcilation";
  tabIndex = 0;
  isAmountMatch: boolean = false;
  isRowSelected: boolean = false;
  showBorder: boolean = false;
  drpReconcilationFor: any;
  drpReconMode: any;
  drpReconFileType: any;
  reconcilationTypes: any = [];
  reconFileTypes: any = [];
  selectedReconFileType1: any;
  reconFileTypesTemp: any = [];
  reconModes: any = [];
  tab: string = "2Way";
  intializeReconTypes: boolean = true;
  intializeReconModes: boolean = true;
  intializeReconFileTypes: boolean = true;
  selectedReconDetIds: Array<any> = [];
  isShowDisabled: boolean = true;
  reconcilationMode: string = "";
  reconlength: number = 0;
  reconWay: Array<any> = [];
  cbsExist = false;
  switchExist = false;
  npciExist = false;
  ejExist = false;
  displayCbs = false;
  displaySwitch = false;
  displayNpci = false;
  displayEJ = false;
  totalRepeaterLength: number = 0;
  totalRepeaterExist: number = 0;
  currentToggleValue: string = "false";
  repeaterMinHeight: any;
  repeaterCardMinHeight: any;
  repeaterToolTip: any;
  selectedRow: any;
  showReconWayHeader: boolean = false;
  isResetDisable: boolean = true;
  showRepeatersDiv: boolean = false;
  screenWidth: any;
  isMinimumRecordSelected: boolean = false;
  rrnNumber: any;
  rrnReportData: any = [];
  rrnDisplayColumns: any;
  //#endregion Common Properties


  //#region 1st Table Properties

  showRepeater1: boolean = false;

  tglSameAmount1: any = "false";
  searchValues1: any;
  repeaterData1: any = [];
  repeaterDataLength1: number = 0;
  repeaterData1Temp: any = [];
  totalAmount1: number = 0;
  totalCount1: number = 0;
  selectedRowIndex1: Array<any> = [];
  showTglSameAmount1: boolean = false;

  //#endregion 1st Table Properties


  //#region 2nd Table Properties

  showRepeater2: boolean = false;
  tglSameAmount2: any = "false";
  searchValues2: any;
  repeaterData2: any = [];
  repeaterDataLength2: number = 0;
  repeaterData2Temp: any = [];
  totalAmount2: number = 0;
  totalCount2: number = 0;
  selectedRowIndex2: Array<any> = [];
  showTglSameAmount2: boolean = false;
  selectedReconFileType2: any;

  //#endregion 2nd Table Properties


  //#region 3rd Table Properties

  showRepeater3: boolean = false;
  tglSameAmount3: any = "false";
  searchValues3: any;
  repeaterData3: any = [];
  repeaterDataLength3: number = 0;
  repeaterData3Temp: any = [];
  totalAmount3: number = 0;
  totalCount3: number = 0;
  selectedRowIndex3: Array<any> = [];
  showTglSameAmount3: boolean = false;
  selectedReconSubType3: any;

  //#endregion 3rd Table Properties


  //#region 4th Table Properties

  showRepeater4: boolean = false;
  tglSameAmount4: any = "false";
  searchValues4: any;
  repeaterData4: any = [];
  repeaterDataLength4: number = 0;
  repeaterData4Temp: any = [];
  totalAmount4: number = 0;
  totalCount4: number = 0;
  selectedRowIndex4: Array<any> = [];
  showTglSameAmount4: boolean = false;
  selectedReconSubType4: any;

  //#endregion 4th Table Properties


  constructor(private dateAdapter: DateAdapter<Date>, private dataService: DataService, private dataStorage: DataStorage, private changeDetectorRefs: ChangeDetectorRef, private modalService: ModalService) {
    this.dateAdapter.setLocale('en-GB');
    this.dtReconbaseDate = this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
  }

  ngOnInit(): void {
    this.getSwitchTypes();
    this.datePicker.nativeElement.focus();
    this.screenWidth = Number(window.innerWidth);
  }

  ngOnChanges(change: SimpleChanges) {
    this.repeaterData1.paginator = this.paginator1;
    this.repeaterData2.paginator = this.paginator2;
    this.repeaterData3.paginator = this.paginator3;
    this.repeaterData4.paginator = this.paginator4;

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
          help_keyword: "GETCBSTYPE",
          //help_keyword: "RECTPFLG",
          help_param: "0#",
          //help_param: "1#" + recon_type_key
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

  showReconcilationData() {

    if (this.dtReconbaseDate) {
      this.resetRepeatersProperties();

      var index = this.reconFileTypes ? this.reconFileTypes.findIndex((x: any) => x.KEY == this.drpReconFileType) : -1;
      if (index != -1) {
        this.selectedReconFileType1 = this.reconFileTypes[index].FILE_NAME;
      }

      this.uInput = {
        keyword: "MANUAL_RECON_DATA_SHOW",
        trandate: this.dtTransactionDate ? moment(this.dtTransactionDate).format("YYYY-MM-DD") : null,
        recon_base_date: this.dtReconbaseDate ? moment(this.dtReconbaseDate).format("YYYY-MM-DD") : null,
        recon_type_mst_id: this.drpSwitchType,
        filename_mst_id: this.drpReconFileType,
        cursor_position: "0",
        cbs_cursor: null,
        switch_cursor: null,
        npci_cursor: null,
        ej_cursor: null,

      }

      try {
        this.dataService.postAtmRecon(this.uInput, this).subscribe(
          data => {
            if (data.error) {
              this.repeaterData1 = null;
              this.showRepeater1 = false;
              Swal.fire("Error", data.error, "error");
            }
            else {
              var reconData = JSON.parse(JSON.stringify(data));
              var keys = Object.keys(reconData);
              this.repeaterData1Temp = JSON.parse(JSON.stringify(reconData.cbs_cursor));
              this.repeaterData1 = new MatTableDataSource(reconData.cbs_cursor as any);

              this.repeaterData2Temp = JSON.parse(JSON.stringify(reconData.switch_cursor));
              this.repeaterData2 = new MatTableDataSource(reconData.switch_cursor as any);

              this.repeaterData3Temp = JSON.parse(JSON.stringify(reconData.npci_cursor));
              this.repeaterData3 = new MatTableDataSource(reconData.npci_cursor as any);

              this.repeaterData4Temp = JSON.parse(JSON.stringify(reconData.ej_cursor));
              this.repeaterData4 = new MatTableDataSource(reconData.ej_cursor as any);
              //this.repeaterData4 = new MatTableDataSource([] as any);//remove
              if (this.repeaterData1.data.length != 0) {
                this.repeaterDataLength1 = this.repeaterData1.data.length;
                this.displayedColumns = Object.keys(this.repeaterData1.data[0]);
                setTimeout(() => {
                  this.repeaterData1.sort = this.sort1;
                  this.repeaterData1.paginator = this.paginator1;
                });
              }

              if (this.repeaterData2.data.length != 0) {
                this.repeaterDataLength2 = this.repeaterData2.data.length;
                this.displayedColumns = (Object.keys(this.repeaterData2.data[0]));
                setTimeout(() => {
                  this.repeaterData2.sort = this.sort2;
                  this.repeaterData2.paginator = this.paginator2;
                });
              }

              if (this.repeaterData3.data.length != 0) {
                this.repeaterDataLength3 = this.repeaterData3.data.length;
                this.displayedColumns = (Object.keys(this.repeaterData3.data[0]));
                setTimeout(() => {
                  this.repeaterData3.sort = this.sort3;
                  this.repeaterData3.paginator = this.paginator3;
                });
              }

              if (this.repeaterData4.data.length != 0) {
                this.repeaterDataLength4 = this.repeaterData4.data.length;
                this.displayedColumns = (Object.keys(this.repeaterData4.data[0]));
                setTimeout(() => {
                  this.repeaterData4.sort = this.sort4;
                  this.repeaterData4.paginator = this.paginator4;
                });
              }

              if (this.displayedColumns) {
                if (Object.keys(this.displayedColumns).length != 0) {
                  if ((Array(this.displayedColumns[0] != "ACTION")[0])) {
                    Array(this.displayedColumns.unshift("ACTION"));
                  }
                }
              }

              if (!this.displayedColumns) {
                this.displayedColumns = this.staticDisplayedColumns;
              }
              var positions = reconData.cursorPosition.split(",");
              positions.forEach((element: any) => {
                this.totalRepeaterLength += Number(element);
              });

              this.reconWay = reconData.reconWay.split("|");
              this.reconlength = this.reconWay.length;

              switch (this.reconlength) {
                case 2: {
                  this.reconcilationMode = "2Way";
                  break;
                }
                case 3: {
                  this.reconcilationMode = "3Way";
                  break;
                }
                case 4: {
                  this.reconcilationMode = "4Way";
                  break;
                }
              }
              var reconWay = "";
              var cbs = "";
              var switch1 = "";
              var npci = "";
              var ej = "";
              //this.reconWay.push("EJ");//remove
              this.reconWay.forEach((element, index) => {
                switch (element) {
                  case "CBS": {
                    this.cbsExist = true;
                    this.showRepeater1 = true;
                    if (this.repeaterData1.data.length != 0) {
                      cbs = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + element + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span> &nbsp; Data Available) </span>' + '</span> </span> ';
                      this.displayCbs = true;
                      this.totalRepeaterExist += 1;
                    }
                    else {
                      cbs = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + element + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span> &nbsp; Data Not Available) </span>' + '</span> </span>';
                      this.displayCbs = false;
                    }
                    break;
                  }
                  case "SWITCH": {
                    this.switchExist = true;
                    this.showRepeater2 = true;
                    if (this.repeaterData2.data.length != 0) {
                      this.displaySwitch = true;
                      switch1 = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + element + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span>&nbsp;  Data Available) </span>' + '</span> </span> ';
                      this.totalRepeaterExist += 1;
                    }
                    else {
                      switch1 = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + element + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span>&nbsp;  Data Not Available) </span>' + '</span> </span>';
                      this.displaySwitch = false;
                    }
                    break;
                  }
                  case "NPCI": {
                    this.npciExist = true;
                    this.showRepeater3 = true;
                    if (this.repeaterData3.data.length != 0) {
                      this.displayNpci = true;
                      npci = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + element + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span>&nbsp;  Data Available) </span>' + '</span> </span> ';
                      this.totalRepeaterExist += 1;
                    }
                    else {
                      this.displayNpci = false;
                      npci = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + element + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span>&nbsp;  Data Not Available) </span>' + '</span> </span>';
                    }
                    break;
                  }
                  case "EJ": {
                    this.ejExist = true;
                    this.showRepeater4 = true;
                    if (this.repeaterData4.data.length != 0) {
                      this.displayEJ = true;
                      ej = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + element + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span>&nbsp;  Data Available) </span>' + '</span> </span> ';
                      this.totalRepeaterExist += 1;
                    }
                    else {
                      this.displayEJ = false;
                      ej = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + element + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span>&nbsp;  Data Not Available) </span>' + '</span> </span>';
                    }
                    break;
                  }
                }
              });

              reconWay = "";

              if (this.cbsExist) {
                if (reconWay == "") {
                  reconWay = cbs;
                }
                else {
                  reconWay += "|" + cbs;
                }
              }

              if (this.switchExist) {
                if (reconWay == "") {
                  reconWay = switch1;
                }
                else {
                  reconWay += "|" + switch1;
                }
              }

              if (this.npciExist) {
                if (reconWay == "") {
                  reconWay = npci;
                }
                else {
                  reconWay += "|" + npci;
                }
              }

              if (this.ejExist) {
                if (reconWay == "") {
                  reconWay = ej;
                }
                else {
                  reconWay += "|" + ej;
                }
              }

              if (reconWay != "") {
                this.showReconWayHeader = true;
              }

              document.getElementById('reconWay')!.innerHTML = reconWay;
              //this.totalRepeaterLength += 1;//remove

              if (this.totalRepeaterExist == this.totalRepeaterLength) {
                this.isProcessDisabled = false;
              }
              else {
                this.isProcessDisabled = true;
              }

              var files = "";
              if (this.cbsExist && !this.displayCbs) {
                if (files == "") {
                  files = "CBS";
                }
                else {
                  files += ", " + "CBS";
                }
              }

              if (this.switchExist && !this.displaySwitch) {
                if (files == "") {
                  files = "SWITCH";
                }
                else {
                  files += ", " + "SWITCH";
                }
              }

              if (this.npciExist && !this.displayNpci) {
                if (files == "") {
                  files = "NPCI";
                }
                else {
                  files += ", " + "NPCI";
                }
              }

              if (this.ejExist && !this.displayEJ) {
                if (files == "") {
                  files = "EJ";
                }
                else {
                  files += ", " + "EJ";
                }
              }

              var temp = files.split(", ");

              if (temp.length == 2) {
                files = files.replace(", ", " and ");
              }

              if (temp.length > 2) {
                var char = ', ';
                var newWord = ' and ';
                var n = files.toLowerCase().lastIndexOf(char.toLowerCase());
                var pat = new RegExp(char, 'i')
                files = files.slice(0, n) + files.slice(n).replace(pat, newWord);
              }

              if ((this.cbsExist && !this.displayCbs) || (this.switchExist && !this.displaySwitch) ||
                (this.npciExist && !this.displayNpci) || (this.ejExist && !this.displayEJ)) {
                Swal.fire("Message", files + " data not found", "info");
              }
              this.calculateMinHeight();
              this.showRepeatersDiv = true;
            }
          }
        );
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please select reconcilation base date',
        icon: 'warning',
      });
    }
  }

  showAmount1(row: any) {
    this.selectedRow = row;
    this.tglSameAmount2 = "false";
    this.tglSameAmount3 = "false";
    this.tglSameAmount4 = "false";
    this.showTglSameAmount1 = false;

    this.repeaterData2.data = this.repeaterData2Temp;
    this.repeaterData3.data = this.repeaterData3Temp;
    this.repeaterData4.data = this.repeaterData4Temp;

    var selectedIndex = this.selectedRowIndex1.findIndex(i => i == row.RECON_DET_ID);
    var reconDetIdIndex = this.selectedReconDetIds.findIndex(i => i == row.RECON_DET_ID);
    if (selectedIndex == -1) {
      this.selectedRowIndex1.push(row.RECON_DET_ID);
      this.selectedReconDetIds.push(row.RECON_DET_ID);
      this.totalAmount1 += row.TRANSACTION_AMOUNT;
      this.totalCount1 += 1;
      this.filterValue = row;
    }
    else {
      this.selectedRowIndex1.splice(selectedIndex, 1);
      this.selectedReconDetIds.splice(reconDetIdIndex, 1);
      this.totalAmount1 -= row.TRANSACTION_AMOUNT;
      this.totalCount1 -= 1;
    }
    if (this.selectedRowIndex1.length != 0) {
      this.showTglSameAmount1 = false;
      this.showTglSameAmount2 = true;
      this.showTglSameAmount3 = true;
      this.showTglSameAmount4 = true;
    }
    else {
      this.showTglSameAmount2 = false;
      this.showTglSameAmount3 = false;
      this.showTglSameAmount4 = false;
    }
    this.minimumRecordSelected();
    this.checkTables("1st");
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }
  }

  showAmount2(row: any) {
    this.selectedRow = row;
    this.tglSameAmount1 = "false";
    this.tglSameAmount3 = "false";
    this.tglSameAmount4 = "false";
    this.showTglSameAmount2 = false;

    this.repeaterData1.data = this.repeaterData1Temp;
    this.repeaterData3.data = this.repeaterData3Temp;
    this.repeaterData4.data = this.repeaterData4Temp;

    var selectedIndex = this.selectedRowIndex2.findIndex(i => i == row.RECON_DET_ID);
    var reconDetIdIndex = this.selectedReconDetIds.findIndex(i => i == row.RECON_DET_ID);
    if (selectedIndex == -1) {
      this.selectedRowIndex2.push(row.RECON_DET_ID);
      this.selectedReconDetIds.push(row.RECON_DET_ID);
      this.totalAmount2 += row.TRANSACTION_AMOUNT;
      this.totalCount2 += 1;
      this.filterValue = row;
    }
    else {
      this.selectedRowIndex2.splice(selectedIndex, 1);
      this.selectedReconDetIds.splice(reconDetIdIndex, 1);
      this.totalAmount2 -= row.TRANSACTION_AMOUNT;
      this.totalCount2 -= 1;
    }
    if (this.selectedRowIndex2.length != 0) {
      this.showTglSameAmount2 = false;
      this.showTglSameAmount1 = true;
      this.showTglSameAmount3 = true;
      this.showTglSameAmount4 = true;
    }
    else {
      this.showTglSameAmount1 = false;
      this.showTglSameAmount3 = false;
      this.showTglSameAmount4 = false;
    }
    this.minimumRecordSelected();
    this.checkTables("2nd");
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }
  }

  showAmount3(row: any) {
    this.selectedRow = row;
    this.tglSameAmount1 = "false";
    this.tglSameAmount2 = "false";
    this.tglSameAmount4 = "false";
    this.showTglSameAmount3 = false;

    this.repeaterData1.data = this.repeaterData1Temp;
    this.repeaterData2.data = this.repeaterData2Temp;
    this.repeaterData4.data = this.repeaterData4Temp;

    var selectedIndex = this.selectedRowIndex3.findIndex(i => i == row.RECON_DET_ID);
    var reconDetIdIndex = this.selectedReconDetIds.findIndex(i => i == row.RECON_DET_ID);
    if (selectedIndex == -1) {
      this.selectedRowIndex3.push(row.RECON_DET_ID);
      this.selectedReconDetIds.push(row.RECON_DET_ID);
      this.totalAmount3 += row.TRANSACTION_AMOUNT;
      this.totalCount3 += 1;
      this.filterValue = row;
    }
    else {
      this.selectedRowIndex3.splice(selectedIndex, 1);
      this.selectedReconDetIds.splice(reconDetIdIndex, 1);
      this.totalAmount3 -= row.TRANSACTION_AMOUNT;
      this.totalCount3 -= 1;
    }
    if (this.selectedRowIndex3.length != 0) {
      this.showTglSameAmount3 = false;
      this.showTglSameAmount1 = true;
      this.showTglSameAmount2 = true;
      this.showTglSameAmount4 = true;
    }
    else {
      this.showTglSameAmount1 = false;
      this.showTglSameAmount2 = false;
      this.showTglSameAmount4 = false;
    }
    this.minimumRecordSelected();
    this.checkTables("3rd");
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }
  }

  showAmount4(row: any) {
    this.selectedRow = row;
    this.tglSameAmount1 = "false";
    this.tglSameAmount2 = "false";
    this.tglSameAmount3 = "false";
    this.showTglSameAmount4 = false;

    this.repeaterData1.data = this.repeaterData1Temp;
    this.repeaterData2.data = this.repeaterData2Temp;
    this.repeaterData3.data = this.repeaterData3Temp;

    var selectedIndex = this.selectedRowIndex4.findIndex(i => i == row.RECON_DET_ID);
    var reconDetIdIndex = this.selectedReconDetIds.findIndex(i => i == row.RECON_DET_ID);
    if (selectedIndex == -1) {
      this.selectedRowIndex4.push(row.RECON_DET_ID);
      this.selectedReconDetIds.push(row.RECON_DET_ID);
      this.totalAmount4 += row.TRANSACTION_AMOUNT;
      this.totalCount4 += 1;
      this.filterValue = row;
    }
    else {
      this.selectedRowIndex4.splice(selectedIndex, 1);
      this.selectedReconDetIds.splice(reconDetIdIndex, 1);
      this.totalAmount4 -= row.TRANSACTION_AMOUNT;
      this.totalCount4 -= 1;
    }
    if (this.selectedRowIndex4.length != 0) {
      this.showTglSameAmount4 = false;
      this.showTglSameAmount1 = true;
      this.showTglSameAmount2 = true;
      this.showTglSameAmount3 = true;
    }
    else {
      this.showTglSameAmount1 = false;
      this.showTglSameAmount2 = false;
      this.showTglSameAmount3 = false;
    }
    this.minimumRecordSelected();
    this.checkTables("4th");
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }
  }

  processManualReconcilation() {
    var reconDetId = "";

    switch (this.reconlength) {
      case 1: {
        this.tab = "1Way";
        break;
      }
      case 2: {
        this.tab = "2Way";
        break;
      }
      case 3: {
        this.tab = "3Way";
        break;
      }
      case 4: {
        this.tab = "4Way";
        break;
      }
    }

    var length = this.selectedReconDetIds.length;
    this.selectedReconDetIds.forEach((element, index) => {
      //var isLastElement = (index == length - 1) ? true : false;
      reconDetId += String(element) + ",";
    });

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to process?",
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes", denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        switch (this.tab) {
          case "2Way": {

            if (this.cbsExist && this.switchExist) {
              if (this.totalAmount1 == this.totalAmount2) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex2.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.cbsExist && this.npciExist) {
              if (this.totalAmount1 == this.totalAmount3) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex3.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.cbsExist && this.ejExist) {
              if (this.totalAmount1 == this.totalAmount4) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex4.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.switchExist && this.npciExist) {
              if (this.totalAmount2 == this.totalAmount3) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex2.length != 0 && this.selectedRowIndex3.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.npciExist && this.ejExist) {
              if (this.totalAmount3 == this.totalAmount4) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex3.length != 0 && this.selectedRowIndex4.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            break;
          }
          case "3Way": {
            if (this.cbsExist && this.switchExist && this.npciExist) {
              if (this.totalAmount1 == this.totalAmount2 && this.totalAmount2 == this.totalAmount3) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex2.length != 0 && this.selectedRowIndex3.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.switchExist && this.npciExist && this.ejExist) {
              if (this.totalAmount2 == this.totalAmount3 && this.totalAmount3 == this.totalAmount4) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex2.length != 0 && this.selectedRowIndex3.length != 0 && this.selectedRowIndex4.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.cbsExist && this.npciExist && this.ejExist) {
              if (this.totalAmount1 == this.totalAmount2 && this.totalAmount2 == this.totalAmount4) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex2.length != 0 && this.selectedRowIndex4.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }

            if (this.cbsExist && this.switchExist && this.ejExist) {
              if (this.totalAmount1 == this.totalAmount3 && this.totalAmount3 == this.totalAmount4) {
                this.isAmountMatch = true;
              }
              else {
                this.isAmountMatch = false;
              }

              if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex3.length != 0 && this.selectedRowIndex4.length != 0) {
                this.isRowSelected = true;
              }
              else {
                this.isRowSelected = false;
              }
            }
            break;
          }
          case "4Way": {
            if (this.totalAmount1 == this.totalAmount2 && this.totalAmount2 == this.totalAmount3 && this.totalAmount3 == this.totalAmount4) {
              this.isAmountMatch = true;
            }
            else {
              this.isAmountMatch = false;
            }

            if (this.selectedRowIndex1.length != 0 && this.selectedRowIndex2.length != 0 && this.selectedRowIndex3.length != 0 && this.selectedRowIndex4.length != 0) {
              this.isRowSelected = true;
            }
            else {
              this.isRowSelected = false;
            }
            break;
          }
        }
        if (this.isRowSelected) {

          if (this.isAmountMatch) {
            this.processFlag = "M";
            this.uInput = {
              keyword: "MANUAL_RECON_DATA_PROCESS",
              trandate: moment(this.dtTransactionDate).format("YYYY-MM-DD"),
              recon_base_date: moment(this.dtReconbaseDate).format("YYYY-MM-DD"),
              recon_det_id: reconDetId,
              flag: this.processFlag
            }

            try {
              this.dataService.postAtmRecon(this.uInput, this).subscribe(
                data => {
                  if (data.error) {
                    Swal.fire("Error", data.error, "error");
                  }
                  else {
                    Swal.fire("Manual Reconcilation", "Process Successful", "success");
                    this.clearAllProperties();
                  }
                }
              );
            }
            catch (e) {
              Swal.fire("Error", String(e), "error");
            }
          }
          else {
            Swal.fire({
              title: "Transaction Amounts Aren't Same",
              text: "Do you want to force match ?",
              icon: 'question',
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: "Yes",
              denyButtonText: "No",
            }).then((result: any) => {
              if (result.isConfirmed) {
                this.processFlag = "F";
                this.uInput = {
                  keyword: "MANUAL_RECON_DATA_PROCESS",
                  trandate: moment(this.dtTransactionDate).format("YYYY-MM-DD"),
                  recon_base_date: moment(this.dtReconbaseDate).format("YYYY-MM-DD"),
                  recon_det_id: reconDetId,
                  flag: this.processFlag
                }

                try {
                  this.dataService.postAtmRecon(this.uInput, this).subscribe(
                    data => {
                      if (data.error) {
                        Swal.fire("Error!", data.error, "error");
                      }
                      else {
                        Swal.fire("Manual Reconcilation!", "Process Successful", "success");
                        this.clearAllProperties();
                      }
                    }
                  );
                }
                catch (e) {
                  console.log(e);
                }
              }
              else if (result.isDenied) {
                Swal.fire('You Cancelled', '', 'info');
              }
            });
          }
        }
        else {

          var cbs = "";
          var switch1 = "";
          var npci = "";
          var ej = "";
          var tables = "";

          if (this.cbsExist && this.selectedRowIndex1.length == 0) {
            if (tables == "") {
              tables += "CBS";
            }
            else {
              tables += "," + "CBS";
            }
          }

          if (this.switchExist && this.selectedRowIndex2.length == 0) {
            if (tables == "") {
              tables += "Switch";
            }
            else {
              tables += "," + "Switch";
            }
          }

          if (this.npciExist && this.selectedRowIndex3.length == 0) {
            if (tables == "") {
              tables += "NPCI";
            }
            else {
              tables += "," + "NPCI";
            }
          }

          if (this.ejExist && this.selectedRowIndex4.length == 0) {
            if (tables == "") {
              tables += "EJ";
            }
            else {
              tables += "," + "EJ";
            }
          }

          Swal.fire({
            title: 'Warning!',
            text: 'Please select record from ' + tables,
            icon: 'warning',
          });
        }
      } else if (result.isDenied) {
        Swal.fire('You Cancelled', '', 'info');
      }
    });
  }

  filterTable1(filterValue: any, control: any, filter?: string, isToggle?: any) {
    switch (control) {
      case "Search": {
        if (filterValue.trim() != "") {
          this.repeaterData1.filter = filterValue.trim().toLowerCase();
        }
        else {
          this.repeaterData1.filter = null;
        }
        break;
      }
      case "Toggle": {
        this.currentToggleValue = this.tglSameAmount1;
        if (isToggle) {
          this.selectedRowIndex1 = [];
          this.totalAmount1 = 0;
          this.totalCount1 = 0;
        }

        this.repeaterData1.data = JSON.parse(JSON.stringify(this.repeaterData1Temp))
        if (filter == "true") {
          this.repeaterData1Temp.forEach((element: any) => {
            if (element.RRN_NUMBER != filterValue.RRN_NUMBER &&
              element.STAN_NUMBER != filterValue.STAN_NUMBER &&
              element.TRANSACTION_AMOUNT != filterValue.TRANSACTION_AMOUNT) {
              var index = this.repeaterData1.data.findIndex((x: any) => x.RECON_DET_ID == element.RECON_DET_ID);
              this.repeaterData1.data.splice(index, 1);
            }
          });
        }

        else {
          this.repeaterData1.data = JSON.parse(JSON.stringify(this.repeaterData1Temp));
        }

        this.repeaterData1.sort = this.sort1;
        break;
      }
    }
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }
  }

  filterTable2(filterValue: any, control: any, filter?: string, isToggle?: any) {
    switch (control) {
      case "Search": {
        if (filterValue.trim() != "") {
          this.repeaterData2.filter = filterValue.trim().toLowerCase();
        }
        else {
          this.repeaterData2.filter = null;
        }
        break;
      }
      case "Toggle": {

        if (isToggle) {
          this.selectedRowIndex2 = [];
          this.totalAmount2 = 0;
          this.totalCount2 = 0;
        }

        this.repeaterData2.data = JSON.parse(JSON.stringify(this.repeaterData2Temp))
        if (filter == "true") {
          this.repeaterData2Temp.forEach((element: any) => {
            if (element.RRN_NUMBER != filterValue.RRN_NUMBER &&
              element.STAN_NUMBER != filterValue.STAN_NUMBER &&
              element.TRANSACTION_AMOUNT != filterValue.TRANSACTION_AMOUNT) {
              var index = this.repeaterData2.data.findIndex((x: any) => x.RECON_DET_ID == element.RECON_DET_ID);
              this.repeaterData2.data.splice(index, 1);
            }
          });
        }
        else {
          this.repeaterData2.data = JSON.parse(JSON.stringify(this.repeaterData2Temp));
        }

        this.repeaterData2.sort = this.sort2;
        break;
      }
    }

    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }

  }

  filterTable3(filterValue: any, control: any, filter?: string, isToggle?: any) {
    switch (control) {
      case "Search": {
        if (filterValue.trim() != "") {
          this.repeaterData3.filter = filterValue.trim().toLowerCase();
        }
        else {
          this.repeaterData3.filter = null;
        }
        break;
      }
      case "Toggle": {

        if (isToggle) {
          this.selectedRowIndex3 = [];
          this.totalAmount3 = 0;
          this.totalCount3 = 0;
        }

        this.repeaterData3.data = JSON.parse(JSON.stringify(this.repeaterData3Temp))
        if (filter == "true") {
          this.repeaterData3Temp.forEach((element: any) => {
            if (element.RRN_NUMBER != filterValue.RRN_NUMBER &&
              element.STAN_NUMBER != filterValue.STAN_NUMBER &&
              element.TRANSACTION_AMOUNT != filterValue.TRANSACTION_AMOUNT) {
              var index = this.repeaterData3.data.findIndex((x: any) => x.RECON_DET_ID == element.RECON_DET_ID);
              this.repeaterData3.data.splice(index, 1);
            }
          });
        }
        else {
          this.repeaterData3.data = JSON.parse(JSON.stringify(this.repeaterData3Temp));
        }

        this.repeaterData3.sort = this.sort3;
        break;
      }
    }
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
    }
  }

  filterTable4(filterValue: any, control: any, filter?: string, isToggle?: any) {
    switch (control) {
      case "Search": {
        if (filterValue.trim() != "") {
          this.repeaterData4.filter = filterValue.trim().toLowerCase();
        }
        else {
          this.repeaterData4.filter = null;
        }
        break;
      }
      case "Toggle": {

        if (isToggle) {
          this.selectedRowIndex4 = [];
          this.totalAmount4 = 0;
          this.totalCount4 = 0;
        }

        this.repeaterData4.data = JSON.parse(JSON.stringify(this.repeaterData4Temp))
        if (filter == "true") {
          this.repeaterData4Temp.forEach((element: any) => {
            if (element.RRN_NUMBER != filterValue.RRN_NUMBER &&
              element.STAN_NUMBER != filterValue.STAN_NUMBER &&
              element.TRANSACTION_AMOUNT != filterValue.TRANSACTION_AMOUNT) {
              var index = this.repeaterData4.data.findIndex((x: any) => x.RECON_DET_ID == element.RECON_DET_ID);
              this.repeaterData4.data.splice(index, 1);
            }
          });
        }
        else {
          this.repeaterData4.data = JSON.parse(JSON.stringify(this.repeaterData4Temp));
        }

        this.repeaterData4.sort = this.sort4;
        break;
      }
    }
    if (this.repeaterDataLength1 != this.repeaterData1.filteredData.length || this.repeaterDataLength2 != this.repeaterData2.filteredData.length
      || this.repeaterDataLength3 != this.repeaterData3.filteredData.length || this.repeaterDataLength4 != this.repeaterData4.filteredData.length) {
      this.calculateMinHeight();
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
    this.dtReconbaseDate = this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
    this.drpSwitchType = null;
    this.processFlag = "";
    this.drpReconcilationFor = null;
    this.drpReconMode = null;
    this.drpReconFileType = null;
    this.showRepeater1 = false;
    this.tglSameAmount1 = "false";
    this.searchValues1 = null;
    this.totalAmount1 = 0;
    this.selectedRowIndex1 = [];
    this.showTglSameAmount1 = false;
    this.reconcilationTypes = [];
    this.reconModes = [];
    this.reconFileTypes = [];

    this.showTglSameAmount2 = false;
    this.selectedRowIndex2 = [];
    this.totalAmount2 = 0;
    this.searchValues2 = null;
    this.tglSameAmount2 = "false";
    this.showRepeater2 = false;

    this.showTglSameAmount3 = false;
    this.selectedRowIndex3 = [];
    this.totalAmount3 = 0;
    this.searchValues3 = null;
    this.tglSameAmount3 = "false";
    this.showRepeater3 = false;

    this.showTglSameAmount4 = false;
    this.selectedRowIndex4 = [];
    this.totalAmount4 = 0;
    this.repeaterData4 = [];
    this.searchValues4 = null;
    this.tglSameAmount4 = "false";
    this.showRepeater4 = false;

    this.isProcessDisabled = true;
    this.showBorder = false;
    this.tab = "2way";
    this.intializeReconTypes = true;
    this.intializeReconModes = true;
    this.intializeReconFileTypes = true;
    this.selectedReconDetIds = [];
    this.isShowDisabled = true;
    this.totalCount1 = 0;
    this.totalCount2 = 0;
    this.totalCount3 = 0;
    this.totalCount4 = 0;
    this.reconcilationMode = "";
    this.reconlength = 0;
    this.reconWay = [];
    this.cbsExist = false;
    this.switchExist = false;
    this.npciExist = false;
    this.ejExist = false;
    this.totalRepeaterLength = 0;
    this.totalRepeaterExist = 0;
    this.selectedRow = null;
    this.repeaterDataLength1 = 0;
    this.repeaterDataLength2 = 0;
    this.repeaterDataLength3 = 0;
    this.repeaterDataLength4 = 0;
    this.repeaterMinHeight = null;
    this.repeaterCardMinHeight = null;
    this.showReconWayHeader = false;
    this.isResetDisable = true;
    this.showRepeatersDiv = false;
    this.isRowSelected = false;
    document.getElementById('reconWay')!.innerHTML = "";
    this.getSwitchTypes();
  }

  checkTables(table: any) {
    switch (table) {
      case "1st": {
        if (this.selectedRowIndex1.length != 0) {
          this.showTglSameAmount2 = true;
          this.showTglSameAmount3 = true;
          this.showTglSameAmount4 = true;
        }

        break;
      }
      case "2nd": {
        if (this.selectedRowIndex2.length != 0) {
          this.showTglSameAmount1 = true;
          this.showTglSameAmount3 = true;
          this.showTglSameAmount4 = true;
        }
        break;
      }
      case "3rd": {
        if (this.selectedRowIndex3.length != 0) {
          this.showTglSameAmount1 = true;
          this.showTglSameAmount2 = true;
          this.showTglSameAmount4 = true;
        }
        break;
      }
      case "4th": {
        if (this.selectedRowIndex4.length != 0) {
          this.showTglSameAmount1 = true;
          this.showTglSameAmount2 = true;
          this.showTglSameAmount3 = true;
        }
        break;
      }
    }
  }

  selectReconFileType() {
    this.isShowDisabled = false;
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

    setTimeout(() => {
      if (this.cbsExist) {
        repeater1Height = document.getElementsByClassName("repeater1")[0]!.clientHeight;
        repeater1Length = this.repeaterData1.filteredData.length;
        this.repeaterDataLength1 = repeater1Length;
      }
      if (this.switchExist) {
        repeater2Height = document.getElementsByClassName("repeater2")[0]!.clientHeight;
        repeater2Length = this.repeaterData2.filteredData.length;
        this.repeaterDataLength2 = repeater2Length;
      }
      if (this.npciExist) {
        repeater3Height = document.getElementsByClassName("repeater3")[0]!.clientHeight;
        repeater3Length = this.repeaterData3.filteredData.length;
        this.repeaterDataLength3 = repeater3Length;
      }
      if (this.ejExist) {
        repeater4Height = document.getElementsByClassName("repeater4")[0]!.clientHeight;
        repeater4Length = this.repeaterData4.filteredData.length;
        this.repeaterDataLength4 = repeater4Length;
      }

      if (repeater1Length >= repeater2Length && repeater1Length >= repeater3Length && repeater1Length >= repeater4Length) {
        repeaterMinHeight = repeater1Height;
      }

      if (repeater2Length >= repeater1Length && repeater2Length >= repeater3Length && repeater2Length >= repeater4Length) {
        repeaterMinHeight = repeater2Height;
      }

      if (repeater3Length >= repeater1Length && repeater3Length >= repeater2Length && repeater3Length >= repeater4Length) {
        repeaterMinHeight = repeater3Height;
      }

      if (repeater4Length >= repeater1Length && repeater4Length >= repeater2Length && repeater4Length >= repeater3Length) {
        repeaterMinHeight = repeater4Height;
      }
      this.repeaterMinHeight = repeaterMinHeight + 20 + "px";
      this.repeaterCardMinHeight = repeaterMinHeight + 65 + "px";
    });
  }

  showTooltip(tooltip: any, row: any) {
    var rowData = row;
    var chars = { '{': '', '}': '', '"': '', ':': ' : ', ',': '\n' };
    this.repeaterToolTip = JSON.stringify(rowData).replace(/[{}":,]/g, m => (chars as any)[m]);
    tooltip.show();
  }

  hideTooltip(tooltip: any) {
    tooltip.hide();
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

  resetRepeatersProperties() {
    document.getElementById('reconWay')!.innerHTML = "";
    this.selectedRowIndex1 = [];
    this.selectedRowIndex2 = [];
    this.selectedRowIndex3 = [];
    this.selectedRowIndex4 = [];
    this.selectedReconDetIds = [];
    this.showRepeater1 = false;
    this.showRepeater2 = false;
    this.showRepeater3 = false;
    this.showRepeater4 = false;
    this.repeaterDataLength1 = 0;
    this.repeaterDataLength2 = 0;
    this.repeaterDataLength3 = 0;
    this.repeaterDataLength4 = 0;
    this.showTglSameAmount1 = false;
    this.showTglSameAmount2 = false;
    this.showTglSameAmount3 = false;
    this.showTglSameAmount4 = false;

    this.totalAmount1 = 0;
    this.totalAmount2 = 0;
    this.totalAmount3 = 0;
    this.totalAmount4 = 0;

    this.totalCount1 = 0;
    this.totalCount2 = 0;
    this.totalCount3 = 0;
    this.totalCount4 = 0;

    this.cbsExist = false;
    this.switchExist = false;
    this.npciExist = false;
    this.ejExist = false;
    this.displayCbs = false;
    this.displaySwitch = false;
    this.displayNpci = false;
    this.displayEJ = false;
    this.totalRepeaterLength = 0;
    this.totalRepeaterExist = 0;
    this.repeaterMinHeight = null;
    this.repeaterCardMinHeight = null;
    this.showReconWayHeader = false;
    this.showRepeatersDiv = false;
  }

  onPaginateChange(page: any) {
    this.calculateMinHeight();
  }

  onResize(event: any) {
    this.screenWidth = Number(window.innerWidth);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      if (this.selectedReconDetIds.length > 0) {
        this.rejectTransactions();
      }
    }
    if (event.key === 'F4') {
      this.selectedRow = null;
    }
  }

  minimumRecordSelected() {
    if (this.selectedRowIndex1.length != 0 || this.selectedRowIndex2.length != 0 || this.selectedRowIndex3.length != 0 || this.selectedRowIndex4.length != 0) {
      this.isMinimumRecordSelected = true;
    }
    else {
      this.isMinimumRecordSelected = false;
    }
  }

  rejectTransactions() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject/delete transaction?",
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedReconDetIds.forEach((element, index) => {
          this.uInput = {
            keyword: "RECORD_REJECTED",
            recon_det_id: element,
            trandate: moment(this.dtTransactionDate).format("YYYY-MM-DD"),
            userid: this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null
          }

          try {
            this.dataService.postAtmRecon(this.uInput, this).subscribe(
              data => {
                if (data.error) {
                  Swal.fire("Error", data.error, "error");
                  return;
                }
                else {
                  //Swal.fire("Transaction rejected/deleted successfully");
                  Swal.fire("Reject Transaction", "Transaction rejected/deleted successfully", "success");
                }
              }
            );
          }
          catch (e) {
            Swal.fire("Error", String(e), "error");
          }
        });
        this.showReconcilationData();
      } else if (result.isDenied) {
        Swal.fire('You Cancelled', '', 'info');
      }
    });

  }

  getRRNNumberReport(modal: any, selectedRow: any) {
    this.rrnNumber = selectedRow.RRN_NUMBER;

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to see RRN wise search report?",
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.uInput = {
          keyword: "RRN_ALLRECORD_REPORT",
          rrn_number: this.rrnNumber,
          enter_user_id: this.dataStorage.loginUserDetails[0].USERID ? this.dataStorage.loginUserDetails[0].USERID : null,
          enter_desc: "E1"
        }

        try {
          this.dataService.postAtmRecon(this.uInput, this).subscribe(
            (data: any) => {
              if (data.error) {
                Swal.fire("Error", data.error, "error");
                return;
              }
              else {
                this.rrnReportData = data;
                this.rrnDisplayColumns = Object.keys(data[0]);
                this.modalService.open(modal);
              }
            }
          );
        }
        catch (e) {
          Swal.fire("Error", String(e), "error");
        }
      } else if (result.isDenied) {
        Swal.fire('You Cancelled', '', 'info');
      }
    });

  }
}