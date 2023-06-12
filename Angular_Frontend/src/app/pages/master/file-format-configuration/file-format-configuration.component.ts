import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-file-format-configuration',
  templateUrl: './file-format-configuration.component.html',
  styleUrls: ['./file-format-configuration.component.scss']
})
export class FileFormatConfigurationComponent implements OnInit {

  viewRepeater: boolean = false;
  fileFormat: any = {};
  fileFormatArray: any = [];
  fileTypeArray: any = [];
  fileNameArray: any = [];
  reconIdArray: any = [];
  reconFileFlagArray: any = [];
  fileFormatRepeater: MatTableDataSource<any> | any;
  displayedColumns: string[] = ['FILENAME_MST_ID','FILE_NAME','FILE_FORMAT_TYPE','FILE_TYPE','TRANSACTION_DATE','action'];
  modifyClick: boolean = false;
  
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  
  
  constructor(private dataService: DataService) {
    
  }
  
  ngOnInit(): void {
    this.fileNameMethod('fileName');
    // this.fileNameMethod('fileRepeater');
  }

  //To get file name array and file name mst id 
  fileNameMethod = (data: string) => {
    let request = {
      "keyword": "HELP",
      "request_from": "SYS",
      "app_mode": "SYS",
      "transaction_key": "VGIPL",
      "help_keyword": "",
      "help_param": "0",
      // "enter_user_id": "",
      "enter_desc": "E1",
      "error": null,
      "cursor": null
    }
    switch (data) {
      case 'fileName': //To get file name array and file name mst id 
        request.help_keyword = 'FILEMSTID'
        break;
      case 'reconMstId': //To get recon mst id array
        request.help_keyword = 'RECTPID'
        break;
      case 'fileType': //To get file type array
        request.help_keyword = 'FILETYPE'
        break;
      case 'fileFormat': //To get fileType format array
        request.help_keyword = 'FILEFORTYPE'
        break;
      case 'reconFlag': //To get recon flag array
        request.help_keyword = 'RECTYPEFLG'
        break;
      case 'fileRepeater': //To get file format repeater
        request.help_keyword = 'GETFILEFORM'
        break;
    }
    this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
      try{
        switch (data) {
          case 'fileName':
            this.fileNameArray = result;
            this.fileNameMethod('reconMstId');
            break;
          case 'reconMstId':
            this.reconIdArray = result;
            this.fileNameMethod('fileType');
            break;
          case 'fileType':
            this.fileTypeArray = result;
            this.fileNameMethod('fileFormat');
            break;
          case 'fileFormat':
            this.fileFormatArray = result;
            this.fileNameMethod('reconFlag');
            break;
          case 'reconFlag':
            this.reconFileFlagArray = result;
            // this.fileNameMethod('fileRepeater');
            break;
          case 'fileRepeater':
            // this.fileFormatRepeater = result;
            this.fileFormatRepeater = new MatTableDataSource(result);
            this.viewRepeater = true;
            this.loadTableViewChild();
            break;
        }
      } catch(err){
        Swal.fire({
          title: 'Error!',
          text: 'Error',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }


  showRepeater() {
    if(!this.viewRepeater){
      this.fileNameMethod('fileRepeater');
    } else {
      this.viewRepeater = false;
    }
  }

  loadTableViewChild(){
    if(this.fileFormatRepeater){
      this.fileFormatRepeater.paginator = this.paginator ? this.paginator : null;
      this.fileFormatRepeater.sort = this.sort? this.sort : null;
    }
  }

  saveFile = (data: any) => {
    if (this.fileFormat.recon_type_mst_id && this.fileFormat.recon_type_flag && this.fileFormat.file_format_type
      && this.fileFormat.file_type && this.fileFormat.file_name && this.fileFormat.onus_number
      && this.fileFormat.SEPRATED_flag && this.fileFormat.SEPRATED_char && this.fileFormat.RECON_WAY) {
      let request =
      {
        "keyword": "RECON_FILENAME_FORMAT",
        "opflag": "N",
        "transaction_date": new Date().toISOString().slice(0, 10),
        "transaction_time": new Date().toLocaleTimeString(),
        "request_from": "CBS",
        "app_mode": "ATM",
        "transaction_key": "VGIPL",
        "filename_mst_id": null,
        "recon_type_mst_id": data.recon_type_mst_id,
        "recon_type_flag": data.recon_type_flag,
        "file_format_type": data.file_format_type,
        "file_type": data.file_type,
        "file_name": data.file_name,
        "onus_number": data.onus_number,
        "file_extension": "",
        "SEPRATED_flag": data.SEPRATED_flag ? 'Y' : 'N',
        "SEPRATED_char": data.SEPRATED_char,
        "RECON_WAY": (+ data.RECON_WAY),
        // "enter_user_id": "",
        "enter_desc": "",
        "error": null,
        "cursor": null
      }
      if(this.modifyClick == true){
        request['opflag'] = 'M';
        request['filename_mst_id'] = this.fileFormat.filename_mst_id;
      }
      this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
        try{
          if (result.filename_mst_id) {
            if(this.modifyClick == true){
              Swal.fire({
                title: 'Success!',
                text: 'File Modified Successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              })
            } else{
              Swal.fire({
                title: 'Success!',
                text: 'File Created Successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              })
            }
            this.clearData();
          } else {
            Swal.fire({
              title: 'Error!',
              text: result.error,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        } catch(err){
          Swal.fire({
            title: 'Error!',
            text: err,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      })
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please Fill All The Fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }

  }

  bindValue(value: any){
    console.log("Bind value",value);
    let request =
      {
        "keyword": "RECON_FILENAME_FORMAT",
        "opflag": "V",
        "transaction_date": value.TRANSACTION_DATE,
        "transaction_time": new Date().toLocaleTimeString(),
        "request_from": "CBS",
        "app_mode": "ATM",
        "transaction_key": "VGIPL",
        "filename_mst_id": value.FILENAME_MST_ID,
        "file_format_type": value.FILE_FORMAT_TYPE,
        "file_type": value.FILE_TYPE,
        "file_name": value.FILE_NAME,
        "error": null,
        "cursor": null
      }
      this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
        console.log("Bind Value data",result)
        this.fileFormat.recon_type_mst_id = result.RECON_TYPE_MST_ID;
        this.fileFormat.file_name = result.FILE_NAME;
        this.fileFormat.file_type = result.FILE_TYPE;
        this.fileFormat.file_format_type = result.FILE_FORMAT_TYPE;
        this.fileFormat.recon_type_flag = result.RECON_TYPE_FLAG;
        this.fileFormat.onus_number = result.ONUS_NUMBER;
        this.fileFormat.SEPRATED_flag = result.SEPRATED_FLAG == 'Y' ? true : false;
        this.fileFormat.SEPRATED_char = result.SEPRATED_CHAR;
        this.fileFormat.filename_mst_id = result.FILENAME_MST_ID;
        this.fileFormat.RECON_WAY = result.RECON_WAY;
        this.modifyClick = true;
        this.viewRepeater = false;
      })
  }

  clearData = () => {
    this.fileFormat = {};
    this.modifyClick = false;
  }

}
