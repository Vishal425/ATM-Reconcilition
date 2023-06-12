import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
declare var require: any
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
const Swal = require('sweetalert2')
@Component({
  selector: 'app-data-load-ebanker',
  templateUrl: './data-load-ebanker.component.html',
  styleUrls: ['./data-load-ebanker.component.scss']
})
export class DataLoadEbankerComponent implements OnInit {
  txtFromDate = new Date();
  txtToDate = new Date();
  record:any;
  file_format_type:any;
  recon_type_mst_id:any;
  viewRepeater: boolean = false;
  reconType:any;
  submitBtn: boolean = false;
  displayedColumns: string[] = ['RECON_DET_ID','CARD_NO','OUR_ACCOUNT_NUMBER','OUR_ACCOUNT_NAME','RRN_NUMBER','STAN_NUMBER','BRANCH_CODE','BRANCH_NAME'];
  txtreconTypeId = null;
  txtOpFlag: string = 'N';
  text='submit';
  uInput:any;
  fileFormat:any;
  date1=new Date();
  date = new Date().toLocaleDateString('en-CA');
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  fileFormatRepeater: MatTableDataSource<any> | any;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    let uInput =
    {
      keyword: "HELP",
      transaction_date: "2021-08-05",
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "RECTPID",
      help_param: "0",
      enter_user_id: 1,
      enter_desc: "E1",
      error: null,
      cursor: null
    }
    try {
      this.dataService.postAtmRecon(uInput, this).subscribe(
        data => {
          this.reconType = data;
        });
    }
    catch (e) {
      console.log(e);
    }

  }

  someMethod(event:any){
    console.log("event",event);
    let uInput =
    {
      keyword: "HELP",
      transaction_date: "2021-08-05",
      transaction_time: "",
      request_from: "SYS",
      app_mode: "SYS",
      transaction_key: "VGIPL",
      help_keyword: "FILEFORMTP",
      //help_keyword:"LOADFRCBS",
      help_param: event+"#",
      enter_user_id: 1,
      enter_desc: "E1",
      error: null,
      cursor: null
    }
    try {
      this.dataService.postAtmRecon(uInput, this).subscribe(
        data => {
          this.fileFormat = data;
        });
    }
    catch (e) {
      console.log(e);
    }

  }

  bind(data: any) {
    this.txtOpFlag = 'V';
    this.txtreconTypeId = data.PK;
    this.submit('edit');
  }

  submit(element?: any){
    this.uInput = {
      keyword: "RECON_AUTO_DATA_SHOW",
      // opflag: this.txtOpFlag,
      // transaction_key: "VGIPL",
      // request_from: "SYS",
      // app_mode: "SYS",
      trandate:  moment(this.date1).format("YYYY-MM-DD"),
      recon_type_mst_id: this.recon_type_mst_id,
      file_format_type: this.file_format_type,
      fromdate: moment(this.txtFromDate).format("YYYY-MM-DD"),
      upto_date: moment(this.txtToDate).format("YYYY-MM-DD"),
      enter_user_id: 1,
      enter_desc: "E1",
    }
    console.log("uInput",this.uInput)
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to show the data?",
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
loadTableViewChild(){
  if(this.fileFormatRepeater){
    this.fileFormatRepeater.paginator = this.paginator ? this.paginator : null;
    this.fileFormatRepeater.sort = this.sort? this.sort : null;
  }
}
savechanges(uInput: any, element: any) {
  console.log("uinput",uInput)
  this.submitBtn = true;
  this.dataService.postAtmRecon(uInput, element).subscribe(
    (data: any) => {
      console.log("data",data)
      this.submitBtn = false;
      try {
      console.log("data",data.length)
        if (data.length > 0) {
          this.fileFormatRepeater = new MatTableDataSource(data);
          this.loadTableViewChild();
            // Swal.fire("Added Successfully")
            // this.clear();
            // this.submit('show')
            this.viewRepeater=true; 
          }
        else if(data.error){
          Swal.fire({
            // title:'No Record Found',
            title:data.error,
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

  clear(){
    this.file_format_type='';
    this.recon_type_mst_id='';
    this.txtFromDate=new Date();
    this.txtToDate=new Date();
    this.viewRepeater=false;
  }

  showRepeater() {
    if(!this.viewRepeater){
      this.viewRepeater = true;
      this.submit('show');
    } else {
      this.viewRepeater = false;
    }
  }
}
