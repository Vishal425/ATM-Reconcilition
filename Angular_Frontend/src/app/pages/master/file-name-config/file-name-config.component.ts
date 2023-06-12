import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';

declare var require: any
const Swal = require('sweetalert2')
@Component({
  selector: 'app-file-name-config',
  templateUrl: './file-name-config.component.html',
  styleUrls: ['./file-name-config.component.scss']
})
export class FileNameConfigComponent implements OnInit {
  txtFileNameMst: any;
  txtFieldDesc: any;
  txtFieldPosition: any;
  txtFieldCode: any;
  txtFieldLength: any;
  txtPadType: any;
  txtPadChar: any;
  txtFromPosition: any;
  txtToPosition: any;
  txtFieldType: any;
  txtFieldFormat: any;
  txtOpFlag: string = 'N';
  text = 'submit';
  fileNameList: any;
  fieldTypeList: any;
  submitBtn: boolean = false;
  viewRepeater: boolean = false;
  showData: any;
  uInput: any;
  fileFormatRepeater: MatTableDataSource<any> | any;
  displayedColumns: string[] = ['FIELD_CODE', 'FIELD_DESC', 'FIELD_POSITION','FIELD_LENGTH','FIELD_TYPE','FROM_POSITION','TO_POSITION','actions'];
  // public dataSource: any = [];
  // date = new Date().toLocaleDateString('en-CA');
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  
  constructor(private dataService: DataService, private loadService: LoaderService,private dataStorage: DataStorage) {
    
  }

  ngOnInit(): void {
    this.dropDown('f1');
    this.dropDown('type');
    console.log("fileFormatRepeater", this.fileFormatRepeater)
   
  }

  dropDown(d1: any) {
    let dropDown = {
      keyword: "HELP",
      transaction_date: "2021-08-05",
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_param: "0",
      enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
      enter_desc: "E1",
      error: null,
      cursor: null,
      help_keyword: ""
    }

    if (d1 == 'f1') {
      dropDown.help_keyword = 'FILEMSTID'
    }
    else if (d1 == 'type') {
      dropDown.help_keyword = 'FIELDTYPE'

    }
    this.savechanges(dropDown, 'drop');
  }
 

  clear() {
    this.txtFileNameMst = "";
    this.txtFieldDesc = "";
    this.txtFieldPosition = "";
    this.txtFieldCode = "";
    this.txtFieldLength = "";
    this.txtPadType = "";
    this.txtPadChar = "";
    this.txtFromPosition = "";
    this.txtToPosition = "";
    this.txtFieldType = "";
    this.txtFieldFormat = "";
    this.text = 'submit';

  }

  submit(element?: any) {
    if (element != 'show' && (this.txtOpFlag == 'N' || this.txtOpFlag == 'M') && (!this.txtFileNameMst || !this.txtFieldDesc || !this.txtFieldPosition || !this.txtFieldCode || !this.txtFieldLength || !this.txtFieldType || !this.txtFromPosition || !this.txtToPosition || !this.txtFieldFormat)) {
      Swal.fire("", "Please enter compulsary fields", "warning");
      return;
    }
    if (element == 'show') {

      this.uInput = {
        keyword: "HELP",
        help_keyword: "FILEMSTID",
        help_param: "0",
        opflag: this.txtOpFlag,
        transaction_key: "VGIPL",
        request_from: "SYS",
        app_mode: "SYS",
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "e1",
        error: null,
        cursor: null,
        transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
      }
    }
    else if (this.txtOpFlag == 'N' || this.txtOpFlag == 'V' || this.txtOpFlag == 'M') {
      this.uInput = {
        transaction_time: "",
        keyword: "RECON_FILE_CONFIG",
        opflag: this.txtOpFlag,
        transaction_key: "VGIPL",
        request_from: "CBS",
        app_mode: "ATM",
        file_falg: "Y",
        file_config_det_id: this.txtFileNameMst,
        filename_mst: 1,
        field_desc: this.txtFieldDesc,
        field_code: this.txtFieldCode,
        field_position: this.txtFieldPosition,
        field_length: this.txtFieldLength,
        from_position: this.txtFromPosition,
        to_position: this.txtToPosition,
        pad_type: this.txtPadType ? 'Y' : 'N',
        pad_char: this.txtPadChar ? 'Y' : 'N',
        field_type: this.txtFieldType,
        db_column: "G",
        field_format: this.txtFieldFormat,
        transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
        mandetory_flag: "H",
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "RT",
        error: null,
        cursor: null,
      }
    }
    if ((this.txtOpFlag == 'N' || this.txtOpFlag == 'M') && element != 'show') {
      if (this.txtOpFlag == 'M') {
        this.text = 'modify';
      }
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to " + this.text + " this data?",
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      })
        .then((result: any) => {
          if (result.isConfirmed) {
            this.savechanges(this.uInput, element);
          } else {
            return;
          }

        })
    }
    else {
      this.savechanges(this.uInput, element);

    }
  }
  savechanges(uInput: any, element: any) {
    this.submitBtn = true;
    this.dataService.postAtmRecon(uInput, element).subscribe(
      (data: any) => {

        if (element == 'drop' && data[0].FILENAME_MST_ID) {
          this.fileNameList = data;
        }
        if (element == 'drop' && data[0].DESCRIPTION) {
          this.fieldTypeList = data;
        }
        if(element=='show'){
      console.log("data3", data)
      console.log("fileFormatRepeater123", this.fileFormatRepeater)
          this.fileFormatRepeater = new MatTableDataSource(data);
      console.log("fileFormatRepeater", this.fileFormatRepeater)
          this.loadTableViewChild();
        }
      
        this.submitBtn = false;
        try {
          if (!data.error) {
            if (this.txtOpFlag == 'N' && (element != 'show' && element != 'drop')) {
              Swal.fire("Added Successfully")
              this.clear();
              this.submit('show')
              this.viewRepeater=true;
            } else if (this.txtOpFlag == 'M' && (element != 'show' || element != 'drop')) {
              Swal.fire("Updated Successfully")
              this.clear();
              this.submit('show')
              this.viewRepeater=true;
            }
            else if (this.txtOpFlag == 'V' && (element == 'edit' || element != 'drop')) {
              this.txtFieldDesc = data.FIELD_DESC;
              this.txtFieldCode = data.FIELD_CODE;
              this.txtFieldLength = data.FIELD_LENGTH;
              this.txtFromPosition = data.FIELD_POSITION;
              this.txtToPosition = data.TO_POSITION;
              this.txtFieldFormat = data.FIELD_FORMAT;
              this.txtFieldPosition = data.FIELD_POSITION;
              this.txtFieldType = data.FIELD_TYPE;
              // this.date = this.formatDate(data.TRANSACTION_DATE);
              this.txtOpFlag = 'M';
              if (data.PAD_TYPE == 'Y') {
                this.txtPadType = data.PAD_TYPE;
              }
              if (data.PAD_CHAR == 'Y') {
                this.txtPadChar = data.PAD_CHAR;
              }

            }
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
            title: e,
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
  }


  loadTableViewChild(){
    if(this.fileFormatRepeater){
      console.log("paginator", this.paginator)

      this.fileFormatRepeater.paginator = this.paginator ? this.paginator : null;
      this.fileFormatRepeater.sort = this.sort? this.sort : null;
      console.log("fileFormatRepeater", this.fileFormatRepeater)
    }
    console.log("fileFormatRepeater123", this.fileFormatRepeater)
  }

  bind(data: any) {
    this.txtOpFlag = 'V';
    this.txtFileNameMst = data.FILENAME_MST_ID;
    console.log("data", data)
    this.submit('edit');
  }
  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
  showRepeater() {
    if(!this.viewRepeater){
      this.viewRepeater = true;
      this.submit('show');
    } else {
      this.viewRepeater = false;
    }
  }
  onChange(event: any) {
    console.log("event", event.checked);
    if (event.checked == true) {
      this.txtPadType = 'Y';
    }
    else {
      this.txtPadType = 'N';
    }
  }

  emailUpdated(event: any, type: string) {
    if (type == 'to' && !this.txtFromPosition) {
      this.txtToPosition = '';
      Swal.fire("Enter from position..")
      return;
    }
    if (this.txtFromPosition && this.txtToPosition && (this.txtFromPosition >= this.txtToPosition)) {
      Swal.fire("From position always smaller than to position")
      this.txtFromPosition = '';
      this.txtToPosition = '';
      this.txtFieldLength='';
      return;
    }
    if (this.txtFromPosition && this.txtToPosition) {
      this.txtFieldLength = (+this.txtToPosition) - (+this.txtFromPosition);
    }
  }
}
