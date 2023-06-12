import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var require: any;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  txtUserCode = ''

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  checkLogin(){
    this.router.navigate(['/login'])
    return true
  }

  submitPassword(){
    if (this.txtUserCode == undefined || this.txtUserCode == '') {
      Swal.fire({
        title: 'Warning!',
        text: 'Please Enter User Code',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return false;
    }else{
      Swal.fire({
        title: 'Success',
        text: 'Password Linked Sent Your Emails',
        icon: 'success',
        confirmButtonText: 'OK'
      })
      this.txtUserCode = ''
      return false;
    }
  }

}
