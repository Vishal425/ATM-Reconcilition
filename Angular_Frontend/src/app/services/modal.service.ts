import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  pageNameObj: any;
  title = 'appBootstrap';

  closeResult: string = "";
  returnResp: any;
  constructor(private modalService: NgbModal) { }

  open(content: any) {
    console.log(this.pageNameObj);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      console.log(reason + "reason for close");
      this.returnResp = reason;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }

  public getDismissReason(reason: any): string {
    console.log(reason);
    this.returnResp = reason;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  private help = new Subject<any>();
  setHelp(data: any) {
    this.help.next(data);
  }
  getHelp() {
    return this.help.asObservable();
  }

}
