import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-izmjene-nast-prog',
  templateUrl: './izmjene-nast-prog.component.html',
  styleUrls: ['./izmjene-nast-prog.component.css']
})
export class IzmjeneNastProgComponent implements OnInit {
  @Input('label') label: string;
  @Input('link') link: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
