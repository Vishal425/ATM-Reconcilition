import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { switchMap } from 'rxjs/operators';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import * as XLSX from 'xlsx';
const Swal = require('sweetalert2')
declare var require: any

@Component({
  selector: 'app-pdf-generate',
  templateUrl: './pdf-generate.component.html',
  styleUrls: ['./pdf-generate.component.scss']
})

export class PdfGenerateComponent implements OnInit {
  @ViewChild('TABLE', { static: false })
  TABLE!: ElementRef;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  printableColumns = ['ACQUIRER AMOUNT', 'ACQUIRER CNT', 'ISSUER AMOUNT', 'ISSUER CNT', 'ONUS AMOUNT', 'ONUS CNT', 'RECON FLAG', 'RECON TYPE FLAG', 'RGCS AMOUNT', 'RGCS CNT'];
  firstname: any;
  keys: any;
  showData1: any;
  headerData: any;
  n: any;
  heading: any;
  @Input() showData: any;
  @Input() footer: any;
  @Input() name: any;
  onePageCanvas: any;
  total: number = 0;
  bankName: any;
  drpSwitchFileType: any;
  address: any;
  match: boolean = false;
  un_match: boolean = false;
  searchValues: any;
  showData11: MatTableDataSource<any> | any;
  showData12: any;
  fileTypeArray:any = [];
  @ViewChild(MatSort) sort?: MatSort;
  fileFormatRepeater: MatTableDataSource<any> | any;
  constructor(private route: ActivatedRoute, private dataService: DataService,private dataStorage: DataStorage) {
  }

  @ViewChild('htmlData') htmlData: ElementRef | undefined;
  declare window: Window;


  ngOnInit(): void {
    console.log("showData123",this.showData);
    this.fileTypeArray = [
      {"fileTypeId": 1, "fileTypeName": 'Onus'},
      {"fileTypeId": 2, "fileTypeName": 'Issuer'},
      {"fileTypeId": 3, "fileTypeName": 'Aquire'},
      {"fileTypeId": 4, "fileTypeName": 'POS/ECom'}
    ]

    
    // this.route.queryParamMap.subscribe((param: any) => {
    //   console.log(param.params.newArray);
    //   this.showData = JSON.parse(param.params.newArray);
    //   this.dataSource = new MatTableDataSource(this.showData);
    // })

    // this.showData.forEach((element: any) => {
    //   if (element.RECON_FLAG == 'Match') {
    //     this.match = true;
    //   }
    //   if (element.RECON_FLAG == 'UnMatch') {
    //     this.un_match = true;
    //   }
    // });
    // this.showData11 = this.showData.filter((element: any) => element.RECON_FLAG == 'Match')
    // this.showData12 = this.showData.filter((element: any) => element.RECON_FLAG == 'UnMatch')
    // this.heading = this.name;
    // this.getReportHeader();
    // if (this.showData) {
    //   this.keys = Object.keys(this.showData[0]);
    // }

    // this.n = this.showData.length;
    // this.showData1 = this.showData.filter((item: any) => item.groupofbalance1 === 'y');
    // if (this.showData1) {
    //   this.showData.forEach((element: any) => {
    //     this.total = this.total + element.balance1;
    //   });
    // }
    // this.showData = new MatTableDataSource(this.showData);
    // console.log("this.showData",this.showData)
  }

  getFileTypesChange(fileTypeName: any){
    console.log('fTypeId : '  + fileTypeName);
    const filterValue = fileTypeName;
    this.showData.filter = filterValue.trim().toLowerCase();
    console.log('data : '  + this.showData.filter);

  }
  ngOnChanges(){
    console.log("this.showData",this.showData)
    this.showData.forEach((element: any) => {
      if (element.RECON_FLAG == 'Match') {
        this.match = true;
      }
      if (element.RECON_FLAG == 'UnMatch') {
        this.un_match = true;
      }
    });
    this.showData11 = this.showData.filter((element: any) => element.RECON_FLAG == 'Match')
    this.showData12 = this.showData.filter((element: any) => element.RECON_FLAG == 'UnMatch')
    this.heading = this.name;
    this.getReportHeader();
    if (this.showData) {
      this.keys = Object.keys(this.showData[0]);
    }

    this.n = this.showData.length;
    this.showData1 = this.showData.filter((item: any) => item.groupofbalance1 === 'y');
    if (this.showData1) {
      this.showData.forEach((element: any) => {
        this.total = this.total + element.balance1;
      });
    }
    this.showData = new MatTableDataSource(this.showData);
    console.log("this.showData",this.showData)
  }
  // ngAfterViewInit(){
  //   console.log("this.showData",this.showData)

  // }

  // loadTableViewChild() {
  //   if (this.fileFormatRepeater) {
  //     this.fileFormatRepeater.paginator = this.paginator ? this.paginator : null;
  //     this.fileFormatRepeater.sort = this.sort ? this.sort : null;
  //   }
  // }



  getReportHeader() {
    console.log("this.dataStorage.loginUserDetails",this.dataStorage.loginUserDetails)
    let uInputHeaders = {
      keyword: "REPORTS_HEADERS",
      cursor: null,
      transaction_date: this.dataStorage.loginUserDetails[0].WORKING_DATE,
      transaction_time: null,
      request_from: "CBS",
      app_mode: "SYS",
      userid: this.dataStorage.loginUserDetails[0].USERID

    }
    try {
      this.dataService.postAtmRecon(uInputHeaders, this).subscribe(
        data => {
          if (!data.error) {
            console.log("$$$", data);
            this.headerData = data;
            this.bankName = this.headerData[0].BANK_NAME;
            this.address = this.headerData[0].ADDRESS_1;
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
      );
    }
    catch (e) {
      console.log(e);
    }
  }



  exportarPDF(json: any[], Report: string) {
    const pdf = new jsPDF('l', 'pt', 'a4');
    let bankName = this.bankName;
    let title = this.heading;
    let values: any;
    let data = json;
    let privados = ['ACQUIRER AMOUNT', 'ACQUIRER CNT', 'ISSUER AMOUNT', 'ISSUER CNT', 'ONUS AMOUNT', 'ONUS CNT', 'RECON FLAG', 'RECON TYPE FLAG', 'RGCS AMOUNT', 'RGCS CNT'];
    let header = Object.keys(data[0]).filter(key => !privados.includes(key));
    values = data.map((elemento) => Object.values(elemento));
    console.log(values);
    autoTable(pdf,
      {
        head: [header],
        body: values,
        html: '#htmlDataMatch',
        theme: 'grid',
        margin: { top: 80 },
        headStyles: {
          minCellHeight: 10, fontSize: 10, fontStyle: 'bold', halign: 'center',
        },
        didDrawPage: function (data) {
          // Header
          pdf.setFontSize(20);
          pdf.setTextColor(40);
          pdf.text(bankName, 50, 22);
          pdf.text(title, data.settings.margin.top, 50);
        }
      })

    if (this.un_match) {
      autoTable(pdf,
        {
          head: [header],
          body: values,
          html: '#htmlDataUnMatch',
          theme: 'grid',
          headStyles: {
            minCellHeight: 10, fontSize: 10, fontStyle: 'bold', halign: 'center'
          },
        })
    }
    console.log("Impresion PDF");
    pdf.save(this.heading + '.pdf');

  }

  exportarExcel(json: any[], Report: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.heading +'.xlsx');
  }

  filterTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.showData.filter = filterValue.trim().toLowerCase();
  }


}


