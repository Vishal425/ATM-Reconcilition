// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 09/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : master
// Page Name       : auto-reconcilation.ts

// Modify Author   -   Modify Date   - Reason Of Modify
// Akshay B        -   10/08/2021    - Added getSwitchTypes(), getReconTypes(), getReconModes(),
//                                     getReconFileTypes() methods and related properties.
// Akshay B        -   11/08/2021    - Added processAutoReconcilation() method and related properties.
// Akshay B        -   14/08/2021    - Added clearAllProperties() Method.
// ================================================================================================================================== 

import { ChangeDetectorRef, Component, Directive, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-auto-reconcilation',
  templateUrl: './auto-reconcilation.component.html',
  styleUrls: ['./auto-reconcilation.component.scss']
})
export class AutoReconcilationComponent implements OnInit {


  @ViewChild('paginator') paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRefs);

  @ViewChild('sort') sort: MatSort = new MatSort();
  @ViewChild('datePicker', { static: true }) datePicker: any;

  uInput: any;
  displayedColumns: any = [];
  dtTransactionDate: any = new Date();
  dtReconbaseDate: any;
  drpSwitchType: any;
  processFlag: string = "";
  isProcessDisabled: boolean = true;
  switchTypes: any = [];
  filterValue: any;
  reconcilationHeading: string = "Auto Two Way Reconcilation";
  tabIndex = 0;
  reconFileTypes: any = [];
  drpReconFileType: any;
  drpReconMode: any;
  drpReconcilationFor: any;
  reconcilationTypes: any = [];
  reconModes: any = [];
  intializeReconTypes: boolean = true;
  intializeReconModes: boolean = true;
  intializeReconFileTypes: boolean = true;
  reconcilationMode: string = "";
  reconWay: Array<any> = [];
  reconLength: any;
  isResetDisable: boolean = true;
  //#endregion Common Properties

  //#region Table Properties
  showRepeater: boolean = false;
  searchValues: any;
  repeaterData: any = [];


  cbsExist: boolean = false;
  displayCbs: boolean = false;
  switchExist: boolean = false;
  displaySwitch: boolean = false;
  npciExist: boolean = false;
  displayNpci: boolean = false;
  ejExist: boolean = false;
  displayEJ: boolean = false;

  //#endregion Table Properties

  constructor(private dataService: DataService, private dataStorage: DataStorage,
    private changeDetectorRefs: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
    this.dtReconbaseDate = this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
  }

  ngOnInit(): void {
    this.getSwitchTypes();
    this.datePicker.nativeElement.focus();
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
      this.drpReconMode = null;
      this.reconModes = []
      this.drpReconFileType = null;
      this.reconFileTypes = [];

      if (recon_type_key) {
        this.uInput = {
          keyword: "HELP",
          transaction_key: "VGIPL",
          help_keyword: "GETCBSTYPE",
          help_param: "0#",
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


  processAutoReconcilation() {
    if (this.dtReconbaseDate) {
      this.cbsExist = false;
      this.displayCbs = false;
      this.switchExist = false;
      this.displaySwitch = false;
      this.npciExist = false;
      this.displayNpci = false;
      this.ejExist = false;
      this.displayEJ = false;
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to process?",
        icon: 'question',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          // if (this.drpReconSubType3) {
          //   reconDetId = this.drpReconSubType1 + "," + this.drpReconSubType2 + "," + this.drpReconSubType3;
          // }
          // if (this.drpReconSubType4) {
          //   reconDetId = this.drpReconSubType1 + "," + this.drpReconSubType2 + "," + this.drpReconSubType3 + "," + this.drpReconSubType4;
          // }

          //this.processFlag = "M";
          this.uInput = {
            keyword: "AUTO_RECON_PROCESS",
            trandate: moment(this.dtTransactionDate).format("YYYY-MM-DD"),
            recon_base_date: moment(this.dtReconbaseDate).format("YYYY-MM-DD"),
            recon_type_mst_id: this.drpSwitchType,
            file_format_type: this.drpReconcilationFor,
            file_type: this.drpReconFileType,
            cursor: null,
            reconway: null,
            error: null
          }

          try {
            this.dataService.postAtmRecon(this.uInput, this).subscribe(
              data => {
                if (data.error) {
                  Swal.fire("Error", data.error, "error");
                }
                else {
                  this.repeaterData = new MatTableDataSource(data.cursor as any);
                  var reconData = JSON.parse(JSON.stringify(data));
                  if (this.repeaterData.data.length > 0) {
                    this.displayedColumns = Object.keys(this.repeaterData.data[0]);
                    this.showRepeater = true;
                    setTimeout(() => {
                      this.repeaterData.sort = this.sort;
                      this.repeaterData.paginator = this.paginator;
                    });
                  }

                  this.reconWay = reconData.reconWay.split("|");
                  this.reconLength = this.reconWay.length;

                  switch (this.reconLength) {
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
                      case "CBS-0": {
                        this.cbsExist = true;
                        cbs = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + "CBS" + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span> - Data Not Available) </span>' + '</span> </span>';
                        this.displayCbs = false;
                        //Swal.fire("Error", "CBS file not found", "error");
                        break;
                      }

                      case "CBS-1": {
                        this.cbsExist = true;
                        cbs = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + "CBS" + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span> - Data Available) </span>' + '</span> </span> ';
                        this.displayCbs = true;
                        break;
                      }
                      case "SWITCH-0": {
                        this.switchExist = true;
                        switch1 = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + "SWITCH" + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span> - Data Not Available) </span>' + '</span> </span>';
                        this.displaySwitch = false;
                        // Swal.fire("Error", "Switch file not found", "error");
                        break;
                      }
                      case "SWITCH-1": {
                        this.switchExist = true;
                        this.displaySwitch = true;
                        switch1 = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + "SWITCH" + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span> - Data Available) </span>' + '</span> </span> ';
                        break;
                      }
                      case "NPCI-0": {
                        this.npciExist = true;

                        this.displayNpci = false;
                        npci = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + "NPCI" + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span> - Data Not Available) </span>' + '</span> </span>';
                        // Swal.fire({
                        //   title: "Error", text: "NPCI file not found", icon: "error", allowOutsideClick: false,
                        //   allowEscapeKey: false
                        // });

                        break;
                      }
                      case "NPCI-1": {
                        this.npciExist = true;

                        this.displayNpci = true;
                        npci = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + "NPCI" + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span> - Data Available) </span>' + '</span> </span> ';

                        break;
                      }
                      case "EJ-0": {
                        this.ejExist = true;
                        this.displayEJ = false;
                        ej = '<span style="display: inline-grid; text-align: center;"> <span style="color:red;">' + "EJ" + '</span>' + '<span style="font-size: 10px;">' + '<span style="display:flex;">(<span style="display: block; background-color: red;height: 7px;width: 6px;color: red;  margin-top: 6%;">  </span> - Data Not Available) </span>' + '</span> </span>';
                        //Swal.fire("Error", "EJ file not found", "error");
                        break;
                      }
                      case "EJ-1": {
                        this.ejExist = true;

                        this.displayEJ = true;
                        ej = '<span style="display: inline-grid; text-align: center;"> <span style="color:green;">' + "EJ" + '</span>' + '<span style="font-size: 10px;"> ' + '<span style="display:flex;">( <span style="display: block;  background-color: green;height: 7px;width: 6px;color: green; margin-top: 7%;">  </span> - Data Available) </span>' + '</span> </span> ';
                        break;
                      }
                    }
                  });

                  reconWay = "Reconcilation Between : " + cbs;
                  if (this.switchExist) {
                    reconWay += "|" + switch1;
                  }

                  if (this.npciExist) {
                    reconWay += "|" + npci;
                  }

                  if (this.ejExist) {
                    reconWay += "|" + ej;
                  }

                  document.getElementById('reconWay')!.innerHTML = reconWay;
                  var files = "";
                  if (this.cbsExist && !this.displayCbs) {
                    if (files == "") {
                      files = "CBS";
                    }
                    else {
                      files += "," + "CBS";
                    }
                  }

                  if (this.switchExist && !this.displaySwitch) {
                    if (files == "") {
                      files = "SWITCH";
                    }
                    else {
                      files += "," + "SWITCH";
                    }
                  }

                  if (this.npciExist && !this.displayNpci) {
                    if (files == "") {
                      files = "NPCI";
                    }
                    else {
                      files += "," + "NPCI";
                    }
                  }

                  if (this.ejExist && !this.displayEJ) {
                    if (files == "") {
                      files = "EJ";
                    }
                    else {
                      files += "," + "EJ";
                    }
                  }

                  if ((this.cbsExist && !this.displayCbs) || (this.switchExist && !this.displaySwitch) ||
                    (this.npciExist && !this.displayNpci) || (this.ejExist && !this.displayEJ)) {
                    Swal.fire("Error", files + " file not found", "error");
                  }
                  else {
                    Swal.fire("Auto Reconcilation", "Process Successful", "success");
                    this.clearAllProperties();
                  }
                }
              }
            );
          }
          catch (e) {
            console.log(e);
          }

        } else if (result.isDenied) {
          Swal.fire('You Cancelled', '', 'info');
        }
      });
    }
    else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please select base date',
        icon: 'warning',
      });
    }

  }

  clearAllProperties() {
    this.displayedColumns = [];
    this.dtReconbaseDate = this.dataStorage.loginUserDetails[0].WORKING_DATE ? this.dataStorage.loginUserDetails[0].WORKING_DATE : null;
    this.drpSwitchType = null;
    this.processFlag = "";
    this.drpReconcilationFor = null;
    this.drpReconMode = null;
    this.drpReconFileType = null;
    this.reconcilationTypes = [];
    this.reconModes = [];
    this.reconFileTypes = [];
    this.isProcessDisabled = true;
    this.intializeReconTypes = true;
    this.intializeReconModes = true;
    this.intializeReconFileTypes = true;
    this.showRepeater = false;
    this.switchTypes = [];
    this.filterValue = null;
    this.reconcilationMode = "";
    this.reconWay = [];
    this.reconLength = 0;
    this.showRepeater = false;
    this.searchValues = null;
    this.repeaterData = [];
    this.cbsExist = false;
    this.displayCbs = false;
    this.switchExist = false;
    this.displaySwitch = false;
    this.npciExist = false;
    this.displayNpci = false;
    this.ejExist = false;
    this.displayEJ = false;
    this.isResetDisable = true;
    document.getElementById('reconWay')!.innerHTML = "";
    this.getSwitchTypes();
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

  selectReconFileType() {
    this.isProcessDisabled = false;
  }


  filterTable(filterValue: any) {
    if (filterValue.trim() != "") {
      this.repeaterData.filter = filterValue.trim().toLowerCase();
    }
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
}
