import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {HttpClient, HttpHeaders , HttpResponse} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit {

  history = [];
  historyBehaviour :BehaviorSubject<any>;
  res: HttpResponse<any>;
  dataSource :MatTableDataSource<any>;
  private headers = new HttpHeaders().set('Content-type','application/json; charset=utf-8');
  columnsToDisplay = ['DateOfExpense', 'Invoice', 'CreditInfo'];
  expandedElement: Invoice | null;

  constructor(private http:HttpClient) {
    this.historyBehaviour = new BehaviorSubject<any> (this.history);
   }

  ngOnInit() {
    this.fetchData();
    this.historyBehaviour.subscribe(data=>{
      this.dataSource =  new MatTableDataSource(data);
    })
  }

  fetchData=function(){
    this.http.get("http://localhost:3000/history").subscribe(
      res=>{
        this.historyBehaviour.next(res);
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  generatePdf(){
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(documentDefinition).open();
    console.log("*********************");
   }

   downloadpdf(){ 
    const documentDefinition ={ content: 'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(documentDefinition).download();
   }
}

export interface Invoice {
  DateOfExpense: string;
  Invoice: string;
  CreditInfo: number;
  Description: string;
  PickUp: string;
  Destination: string;
  StatusOfTrip: string;
  ModeOfPayment: string;
}

