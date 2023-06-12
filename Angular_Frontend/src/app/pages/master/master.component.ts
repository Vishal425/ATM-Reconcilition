// ===========================================================================================================
// Original Author : Akshay Borje
// Creation Date   : 02/08/2021
// Project Name    : ATM RECONCILATION
// Module Name	   : App
// Page Name       : dashboard.ts

// Modify Author   -   Modify Date   -  Reason Of Modify
// Akshay  B       -   29/07/2021    - Added getModuleMenu(), selectMenu() methods and related properties.
// Aditya  M       -   05/08/2021    - Arranged menus, added child and sub child functionality in menus.
// ================================================================================================================================== 
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorage } from 'src/app/core/dataStorage';
import { DataService } from 'src/app/services/data.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent {
  public uiBasicCollapsed = true;
  public samplePagesCollapsed = true;
  public masterCollapsed = true;
  title = "";
  menuModelArr: any[] = [];
  shortMenuArr: any[] = [];

  childMenu: any;
  userDetail: any;
  current = 0;
  private itemsInRow: any;
  isDisabled: boolean = false;
  moduleMenuID: any;
  itemInRowRange: any;
  workingDate:any;
  navItems: any = [];
  moduleID: any;
  disabledReason: any;
  step = 0;
  userName: string = '';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = new Date('');
  date = new Date().toLocaleDateString('en-CA');

  constructor(private dataStorage: DataStorage, private dataService: DataService, private router: Router, private idle: Idle, private keepalive: Keepalive) {
     // sets an idle timeout of 5 seconds, for testing purposes.
     idle.setIdle(1200);
     // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
     idle.setTimeout(20);
     // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
     idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
 
     idle.onIdleEnd.subscribe(() => { 
       this.idleState = 'No longer idle.'
      //  Swal.close();
       this.reset();
     });
     
     idle.onTimeout.subscribe(() => {
       this.idleState = 'Timed out!';
       this.timedOut = true;
       Swal.close();
       this.logOut();
     });
     
     idle.onIdleStart.subscribe((arg) => {
       Swal.fire({
         title: 'Warning!',
         text: 'You\'ve gone idle and will be logout in 20 seconds',
         icon: 'warning',
         confirmButtonText: 'STAY',
       })
         console.log(this.idleState);
     });
 
     idle.onTimeoutWarning.subscribe((countdown) => {
       this.idleState = 'You will time out in ' + countdown + ' seconds!'
     });
 
 
     // sets the ping interval to 15 seconds
     keepalive.interval(15);
 
     keepalive.onPing.subscribe(() => this.lastPing = new Date());
 
     this.reset();
 
  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getModuleMenu(1, "");
    this.getUserName();
  }


  setStep(index: number) {
    this.step = index;
  }

  activeLink(args?: any){
    if(args){
      this.childMenu.forEach((arg: any)=>{
        arg.newMenus.forEach((data: any)=>{
          if(args == data.MENU_MST_ID){
            data.activeRoute = true;
          } else{
            data.activeRoute = false;
          }
        })
      })
    }
     else {
      this.childMenu.forEach((arg: any)=>{
        arg.newMenus.forEach((data: any)=>{
            data.activeRoute = false;
        })
      })
    }
  }

  getModuleMenu(obj: any, str: string): void {

    var uInput =
    {
      keyword: "GET_MENU",
      transaction_key: "VGIPL",
      module_id: 1,
      user_id: this.dataStorage.loginUserDetails[0].USERID
    }


    this.dataService.postAtmRecon(uInput, this).subscribe(
      data => {
        console.log(data);
        if (data) {
          if (data.error) {
            Swal.fire({
              title: 'Error!',
              text: data.error,
              icon: 'error',
              confirmButtonText: 'OK'
            })
            return false;
          }

          console.log(data);
          this.childMenu = data;
          this.childMenu.forEach((arg: any)=>{
            arg.newMenus = [];
            arg.activeRoute = false;
          })
          this.childMenu.forEach((itm: any,ind: number)=>{
            this.childMenu.forEach((arg: any)=>{
              if(itm.MENU_MST_ID == arg.PARENT_MENU_MST_ID){
                itm.newMenus.push(arg);
              }
            })
          })
          // if (this.childMenu.length > 0) {
          //   this.itemsInRow = this.childMenu.length;
          //   this.itemInRowRange = Array.from(Array(this.itemsInRow).keys());
          //   this.listToTree(this.childMenu, {
          //     idKey: 'menu_mst_id',
          //     parentKey: 'parent_menu_mst_id',
          //     childrenKey: 'children'
          //   }, str);
          // }

        }
        else {
          console.log(data);
          alert("Failure");
        }
        return true;
      }
    );
  }

  selectMenu(child: any) {
    this.dataStorage.childMenuInfo = child;
    this.dataService.setNewUserInfo({
      show_menu_screen_flag: child.show_menu_screen_flag,
    });
    // this.router.navigate([child.PAGE_NAME], { queryParams: { mode: child.PARAMETERS, module: child.MODULE_MST_ID, menuid: child.MENU_MST_ID } },);
  }

  getUserName() {
    if(this.dataStorage.loginUserDetails && this.dataStorage.loginUserDetails.length > 0){
      this.userName = this.dataStorage.loginUserDetails[0].LOGIN_NAME;
      this.workingDate = this.dataStorage.loginUserDetails[0].WORKING_DATE;
    }
  }

  listToTree(arr: any, options: any, open: any) {
    options = options || {};
    var ID_KEY = options.idKey || 'id';
    var PARENT_KEY = options.parentKey || 'parent';
    var CHILDREN_KEY = options.childrenKey || 'children';
    var map = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][ID_KEY]) {
        map[arr[i][ID_KEY]] = arr[i];
        arr[i][CHILDREN_KEY] = [];
      }
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][PARENT_KEY]) { // is a child
        if (map[arr[i][PARENT_KEY]]) // for dirty data
        {
          map[arr[i][PARENT_KEY]][CHILDREN_KEY].push(arr[i]); // add child to parent
          arr.splice(i, 1); // remove from root
          i--; // iterator correction
        } else {
          // arr[i][PARENT_KEY] = 0; // clean dirty data
          arr[i][PARENT_KEY] = arr[i][ID_KEY]; // clean dirty data

        }
      }
    };
    this.navItems = arr;
    console.log(this.navItems);
    // if (open == 'FURL') {
    //   this._historyService.open();
    // }
  }


  changePassword(){
    this.router.navigate(['/change-password'])
    return true
  }

  logOut()
  {
    let uInput={
      keyword: "LOGOUT",
      transaction_key: "VGIPL",
      request_from: "CBS",
      app_mode: "ATM",
      user_id:this.dataStorage.loginUserDetails[0].USERID,
      logout_data:null,
      transaction_time: "",
      error: null,
      transaction_date: this.date,
      cursor: null,
      message:null
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: 'error',
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.dataService.postAtmRecon(uInput, 'logout').subscribe(
          (data: any) => {
           
              if (!data.error) {
                this.router.navigate(['/login']);
              }
              else if (data.error) {
              Swal.fire({
                title: data.error,
                icon: 'error',
                confirmButtonText: "OK",
              })
                .then((result: any) => {
                  if (result.isConfirmed) {
                    return;
                  }
    
                })
              }
          });
        }
      return false; 
    })
  }
   
  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }
}


