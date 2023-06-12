import { Component, OnInit } from '@angular/core';

import { trigger, transition, animate, style } from '@angular/animations'
import { DataService } from 'src/app/services/data.service';
import { DataStorage } from 'src/app/core/dataStorage';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate('5000ms', style({ opacity: 1 }))]),
      transition('* => void', [style({ opacity: 1 }), animate('5000ms', style({ opacity: 0 }))]),
    ]),
  ]
})
export class DashboardComponent implements OnInit {
  Data:any;
  current:number=0;
  imageObject: any[] = [{
    image: 'assets/images/bank-slider1.jpg',
    thumbImage: 'Pay your Tax Instantly with DCB e-Banking'
  },
  {
    image: 'assets/images/bank-slider2.jpg',
    thumbImage: 'Make Your Government Payments Instantly at TRA, GBG and so on'
  },
  {
    image: 'assets/images/bank-slider3.jpg',
    thumbImage: 'Pay your salaries on time with DCB e-banking'
  },
  {
    image: 'assets/images/bank-slider4.jpg',
    thumbImage: 'Pay your salaries on time with DCB e-banking'
  },
  {
    image: 'assets/images/bank-slider5.jpg',
    thumbImage: 'Pay your salaries on time with DCB e-banking'
  },
  {
    image: 'assets/images/bank-slider6.png',
    thumbImage: 'Pay your salaries on time with DCB e-banking'
  },
  {
    image: 'assets/images/bank-slider7.jpg',
    thumbImage: 'Pay your salaries on time with DCB e-banking'
  },
  {
    image: 'assets/images/bank-slider8.jpg',
    thumbImage: 'Pay your salaries on time with DCB e-banking'
  }
  ];
    
  constructor(private dataService: DataService,private dataStorage: DataStorage) { }

  ngOnInit(): void {
    setInterval(() => {
      this.current = ++this.current % this.imageObject.length;
    }, 7000);


    var uInput =
    {
      "keyword":"DASHBOARD_REPORT",
      "enter_user_id":1,
      "enter_desc":"E1"
  }
    this.dataService.postAtmRecon(uInput, this).subscribe(
      data => {
        console.log(data);
        this.Data=data;
        console.log("this.Data",this.Data);

      });
  }

}
