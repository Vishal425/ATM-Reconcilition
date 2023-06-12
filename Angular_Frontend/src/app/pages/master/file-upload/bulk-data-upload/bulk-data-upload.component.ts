import { Component, OnInit } from '@angular/core';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
declare var require: any;
const Swal = require('sweetalert2');
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-bulk-data-upload',
  templateUrl: './bulk-data-upload.component.html',
  styleUrls: ['./bulk-data-upload.component.scss']
})
export class BulkDataUploadComponent implements OnInit  {

  cbsFileUpload: any = {};
  cbsFileUploadType: any[] = [
    { value: 'On Us' },
    { value: 'Issuer' },
    { value: 'Aquirer' },
    { value: 'POS/ECOM' },
    { value: 'IMPS ISSUER' },
    { value: 'IMPS AQUIRER' }
  ];
  fileFormatArray: any = [];
  fileTypeArray: any = [];
  fileNameArray: any = [];
  reconIdArray: any = []; //dropDown1
  reconFileFlagArray: any = [];
  uploadedFile: any = {};
  fileData: any;
  fileName:any;

  fileFormatTypeArray: any = []; //dropDown2
  recTypeFlagArray: any = []; //dropDown3
  fileTypeRecArray: any = []; //dropDown4
  selectedFileFormat: string = '';
  uploadedFileRecords: any = [];

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  
  constructor(private dataService: DataService, public dataStorage: DataStorage) { 
  }
  
  ngOnInit(): void {
    // if(evt.target.files[0].type == 'application/pdf'){
      // this.dataService.readPdf('./assets/images/sample.pdf').then(text => 
      //   alert('PDF parsed: ' + text),
      //   reason => console.error(reason));
      // return
    // }
    this.cbsFileUpload.trandate = new Date();
    this.cbsFileUpload.record = [{name: null}];
    this.fileNameMethod('fileName');
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
      "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
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
            // this.fileNameMethod('fileType');
            // this.newFileMethods('fileFormat');
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

  newFileMethods = (arg: string, type?: any) => {
    let request = {
      "keyword": "HELP",
      "request_from": "SYS",
      "app_mode": "SYS",
      "transaction_key": "VGIPL",
      "help_keyword": "",
      "help_param": "",
      "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
      "enter_desc": "E1",
      "error": null,
      "cursor": null
    }
    switch (arg) {
      case 'fileFormat':
        request.help_keyword = 'FILEFORMTP';
        request.help_param = this.cbsFileUpload.recon_type_mst_id + '#';
        break;
      case 'rectFlag':
        request.help_keyword = 'RECTPFLG';
        request.help_param = this.cbsFileUpload.recon_type_mst_id + '#'+ type.KEY;
        this.selectedFileFormat = type.KEY;
        break;
      case 'fileTypeRec':
        request.help_keyword = 'FILETYPEREC';
        request.help_param = this.cbsFileUpload.recon_type_mst_id + '#'+ this.selectedFileFormat +'#'+ type.KEY;
        break;
    }
    this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
      try{
        switch (arg) {
          case 'fileFormat':
            this.fileFormatTypeArray = result;
            break;
          case 'rectFlag':
            this.recTypeFlagArray = result;
            break;
          case 'fileTypeRec':
            this.fileTypeRecArray = result;
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

  selectChange(key:any){
    console.log("key",key);
    let request = {
              "keyword":"RECENT_LOADED_FILE_REPORT",
              "filename_mst_id":key,
              "enter_user_id":1,
              "enter_desc":"E1"
          }          
          this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
            console.log("data",result);
            this.fileName=result;
          });
  }

  getFile(evt: any) {
      // this.cbsFileUpload.file_name = evt.target.files[0].name;
      let proceed: boolean = true;
      if(this.cbsFileUpload.record.length > 0){
        this.cbsFileUpload.record.forEach((data: any)=>{
          if(data.name && evt.target.files[0].name.toLowerCase() == data.name.toLowerCase()){
            Swal.fire({
              title: 'Warning!',
              text: 'File already exist.',
              icon: 'warning',
              confirmButtonText: 'OK'
            })
            proceed = false;
          } 
        })
      }
      if(proceed){
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = async (e: any) => {
          /* read workbook */
          const bstr: string = await e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type:'binary', cellDates:true });
    
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    
          /* save data */
          this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw:false, dateNF: 'dd-mm-yyyy HH:mm:ss'}));
          // this.cbsFileUpload.record = [];
          let fileData = '';
          let len = this.data.length - 1;
          this.data.forEach((itm: any, index: number) => {
            if(itm && itm.length != 0){
              let joinString = itm.join("|") // To seperate each column by '|'
              // let stringData = joinString.replace('.',''); //Replacing '.' with 'space' as per request need
              let stringData = joinString
              stringData = stringData.replace('||','|');
              if(stringData && stringData != ''){
                fileData  =  fileData + stringData + '\n';
              }
              if(len == index){
                this.callBackForFile(evt.target.files[0].name,fileData)
              }
            }
          })
        };
        reader.readAsBinaryString(target.files[0]);
        
      }
  }

  callBackForFile(name: string, file: any){
    this.cbsFileUpload.record.push({name: name});
    this.saveFile(file, name)
  }


  saveFile(data: any, type?: any){
    let request: any;
    if(type == 'reconShow'){
      request = {
        "keyword": "RECON_BULK_DATA_SHOW",
        "recon_type_mst_id": this.cbsFileUpload.recon_type_mst_id,
        "filename_mst_id": this.cbsFileUpload.filename_mst_id,
        "trandate": new Date().toISOString().slice(0, 10),
        "file_name": data.name,
        "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
        "enter_desc": null,
      }
      if(this.uploadedFileRecords && this.uploadedFileRecords.length > 0){
        request['fileid'] = this.uploadedFileRecords[this.uploadedFileRecords.length - 1].fileid;
      }
    } else if(type != 'reconShow'){
      if(this.cbsFileUpload.recon_type_mst_id && this.cbsFileUpload.filename_mst_id ){
          request = {
            "keyword": "RECON_BULK_DATA_IMPORT",
            "recon_type_mst_id": this.cbsFileUpload.recon_type_mst_id,
            "filename_mst_id": this.cbsFileUpload.filename_mst_id,
            "trandate": new Date().toISOString().slice(0, 10),
            "file_name": type,
            "record": data.replace(/,/g, ", "),
            "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
            "enter_desc": null
          }
          if(this.uploadedFileRecords && this.uploadedFileRecords.length > 0){
            request['fileid'] = this.uploadedFileRecords[this.uploadedFileRecords.length - 1].fileid;
          }
      } else {
        Swal.fire({
          title: 'Warning!',
          text: 'Please Fill All The Fields.',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
        return
      }
    }
    console.log("this.cbsFileUpload.file_name2", request);
    this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
      try{
        if(type != 'reconShow'){
          console.log("CBS File Upload",result);
          if(result && typeof(result) != 'string'){
            this.uploadedFileRecords = result;
            this.uploadedFileRecords.forEach((itm: any)=>{
              itm.checked = true;
            })
          }
          this.cbsFileUpload.record.push({name: ''});
          Swal.fire({
            title: 'Success!',
            text: 'File Uploaded Successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          })
          // this.saveFile(data, 'reconShow');
          this.cbsFileUpload.saveFileName = null;
        } else{
          this.uploadedFileRecords = result;
          this.uploadedFileRecords.forEach((itm: any)=>{
            itm.checked = true;
          })
        }
      } catch (err){
        Swal.fire({
          title: 'Error!',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }

  updateRecord(event:any, arg: any){
    let request = {
      "keyword": "RECON_DATA_UPDATE",
      "temp_mst_id": arg.TEMP_MST_ID,
      "flag": "",
      "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
      "enter_desc": "E1",
      "error": null
    }
    if(arg.checked){
      request.flag = 'Y'
    } else if (!arg.checked){
      request.flag = 'N'
    }
    this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
      try{
        if(result.status == 'Sucess'){
          return
          // if(arg.checked){
          //   Swal.fire({
          //     title: 'Checked',
          //     icon: 'success',
          //     confirmButtonText: 'OK'
          //   })
          // } else if (!arg.checked){
          //   Swal.fire({
          //     title: 'Unchecked',
          //     icon: 'info',
          //     confirmButtonText: 'OK'
          //   })
          // }
        } else{
          Swal.fire({
            title: 'Error!',
            text: result.error,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      }catch(err){
        Swal.fire({
          title: 'Error!',
          text: 'Error',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }

  processFile(){
    let request: any = {
      "keyword": "RECON_DATA_PROCESS",
      "recon_type_mst_id": this.cbsFileUpload.recon_type_mst_id,
      "filename_mst_id": this.cbsFileUpload.filename_mst_id,
      "trandate": new Date().toISOString().slice(0, 10),
      // "recon_base_date": this.cbsFileUpload.recon_base_date,
      "file_name": null,
      "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
      "enter_desc": "e1",
      "error": null,
      "cursor": null
    }
    if(this.uploadedFileRecords && this.uploadedFileRecords.length > 0){
      request['fileid'] = this.uploadedFileRecords[this.uploadedFileRecords.length - 1].fileid;
    }
    this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
      try{
        if(result.error){
          Swal.fire({
            title: 'Error!',
            text: result.error,
            icon: 'error',
            confirmButtonText: 'OK'
          })
          // this.uploadedFileRecords = [];
        } else{
          Swal.fire({
            title: 'Success',
            html: '<div>'+
              '<p align="left" style="color: black; text-align: center;">'+"<b>Duplicate Records:</b>" + result[0].DUPLICATE_RECORDS + "</p>"+
              '<p align="left" style="color: black; text-align: center;">'+"<b>Total Records:</b>" + result[0].TOTAL_RECORDS + "</p>"+
              '<p align="left" style="color: black; text-align: center;">'+"<b>Uploaded Records:</b>" + result[0].UPLOADED_RECORDS + "</p>"+
            '</div>' ,
            customClass: {
              popup: 'format-pre'
            },
            icon: 'success',
            confirmButtonText: 'OK'
          })
          this.clearCBSUploadData();
        }
      }catch(err){
        Swal.fire({
          title: 'Error!',
          text: 'Error',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        // this.uploadedFileRecords = [];
      }
    })
  }

  removeFile(data: any, index: number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this file?',
      icon: 'question',
      confirmButtonText: 'Yes',
      showCancelButton: true,
    }).then((result: any)=>{
      if (result.isConfirmed) {
        if (this.uploadedFileRecords && this.uploadedFileRecords.length > 0) {
          let request = {
            "keyword": "RECON_BULK_DATA_DELETE",
            "recon_type_mst_id": this.cbsFileUpload.recon_type_mst_id,
            "filename_mst_id": this.cbsFileUpload.filename_mst_id,
            "trandate": new Date().toISOString().slice(0, 10),
            "file_name": data.name,
            "enter_user_id": this.dataStorage.loginUserDetails[0].USERID,
            "enter_desc": null,
            "fileid": this.uploadedFileRecords[this.uploadedFileRecords.length - 1].fileid
          }
          this.dataService.postAtmRecon(request, this).subscribe((result: any) => {
            try{
              this.cbsFileUpload.record.splice(index,1);
              this.saveFile(data,'reconShow');
            }catch(err){
              Swal.fire({
                title: 'Error!',
                text: result.error,
                icon: 'error',
                confirmButtonText: 'OK'
              })
            }
          })
        }
      } 
    })
  }

  clearCBSUploadData(){
    this.cbsFileUpload = {};
    this.cbsFileUpload.record = [];
    // this.cbsFileUpload.trandate = new Date();
    this.uploadedFileRecords = [];
    this.fileFormatTypeArray = [];
    this.recTypeFlagArray = [];
    this.fileTypeRecArray = [];
  }

  // clearFileUploadService(){
  //   let req = {
  //     "keyword": "TEMP_DATA_DELETE",
  //     "transaction_date": new Date().toISOString().slice(0, 10),
  //     "transaction_time": null,
  //     "request_from": "CBS",
  //     "app_mode": "SYS",
  //     "userid": this.dataStorage.loginUserDetails[0].USERID
  //   }
  //   this.dataService.postAtmRecon(req, this).subscribe((result: any) => {
  //     this.clearCBSUploadData();
  //   })
  // }

}
