import { DatePipe } from '@angular/common';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';
declare var require: any
const $: any = '';

const Swal = require('sweetalert2')
export interface UserData {
 TYPE_CODE: string;
 TRANSACTION_DATE: string;
 TYPE_NAME: string;
}


@Component({
  selector: 'app-switch-master',
  templateUrl: './switch-master.component.html',
  styleUrls: ['./switch-master.component.scss']
})
export class SwitchMasterComponent implements OnInit {
  txtTypeName: any;
  txtuserDbLink:any;
  txtTypeCode: any;
  txtOpFlag: string = 'N';
  txtOpBrMstId: number = 1;
  text = 'submit';
  submitBtn: boolean = false;
  viewRepeater: boolean = false;
  showData: any = [];
  txtreconTypeId = null;
  uInput: any;
  txtLinkFlag:any;
  // date = new Date().toLocaleDateString('en-CA');
  displayedColumns: string[] = ['TYPE_CODE', 'TRANSACTION_DATE', 'TYPE_NAME','actions'];
  dataSource = new MatTableDataSource<UserData>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  fileFormatRepeater: MatTableDataSource<any> | any;
  @ViewChild('switchCode', {static: true}) switchCode:any;

  constructor(private dataService: DataService, private loadService: LoaderService,private dataStorage: DataStorage) {  }
  @HostBinding('hidden')
  hideRouterLink!: boolean;
  ngOnInit(): void {
    this.switchCode.nativeElement.focus();
    // this.submit('show');
  }

 

  clear() {
    this.txtTypeName = "";
    this.txtTypeCode = "";
    this.txtOpFlag = 'N';
    this.text = 'submit';
    this.txtLinkFlag='';
    this.txtuserDbLink='';
  }

  bind(data: any) {
    this.txtOpFlag = 'V';
    this.txtreconTypeId = data.PK;
    this.submit('edit');
  }

  submit(element?: any) {
    if (element != 'show' && (this.txtOpFlag == 'N' || this.txtOpFlag == 'M') && (!this.txtTypeName || !this.txtTypeCode)) {
      Swal.fire("", "Please enter compulsary fields", "warning");
      return;
    }
    if (element == 'show') {
      this.uInput = {
        keyword: "HELP",
        help_keyword: "GETRECONTYPE",
        help_param: "0",
        opflag: this.txtOpFlag,
        transaction_key: "VGIPL",
        request_from: "SYS",
        app_mode: "SYS",
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
        enter_desc: "e1",
        error: null,
        cursor: null,
      }
    }
    else if (this.txtOpFlag == 'N' || this.txtOpFlag == 'V' || this.txtOpFlag == 'M') {
      // console.log(this.date)
      this.uInput = {
        keyword: "RECON_TYPE_MASTER",
        opflag: this.txtOpFlag,
        transaction_key: "VGIPL",
        type_name: this.txtTypeName,
        request_from: "SYS",
        app_mode: "SYS",
        recon_type_mst_id: this.txtreconTypeId,
        type_code: this.txtTypeCode,
        enter_user_id: this.dataStorage.loginUserDetails[0].USERID,
        enter_desc: "e1",
        error: null,
        transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
        cursor: null,
        switch_link_flag:this.txtLinkFlag,
        switch_user_dblink:this.txtuserDbLink

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
        this.submitBtn = false;
        if(element=='show'){
          this.fileFormatRepeater = new MatTableDataSource(data);
          this.loadTableViewChild();
        }
      
        try {
          if (!data.error) {
            if (this.txtOpFlag == 'N' && element != 'show') {
              Swal.fire("Added Successfully")
              this.clear();
              this.submit('show')
              this.viewRepeater=true;
             
            } else if (this.txtOpFlag == 'M' && element != 'show') {
              Swal.fire("Updated Successfully")
              this.clear();
              this.submit('show')
              this.viewRepeater=true;
            }
            else if (this.txtOpFlag == 'V' && element == 'edit') {
              this.txtTypeCode = data.TYPE_CODE;
              this.txtTypeName = data.TYPE_NAME;
              this.txtLinkFlag=data.SWITCH_LINK_FLAG;
              this.txtuserDbLink=data.SWITCH_USER_DBLINK;
              // this.date = this.formatDate(data.TRANSACTION_DATE);
              this.txtOpFlag = 'M';
            }
            }
          else {
            Swal.fire({
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


  loadTableViewChild(){
    if(this.fileFormatRepeater){
      this.fileFormatRepeater.paginator = this.paginator ? this.paginator : null;
      this.fileFormatRepeater.sort = this.sort? this.sort : null;
    }
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
}
