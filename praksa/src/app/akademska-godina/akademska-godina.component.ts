import { Component, Input, OnInit } from '@angular/core';
interface Link {
  label: string, link: string
}

@Component({
  selector: 'app-akademska-godina',
  templateUrl: './akademska-godina.component.html',
  styleUrls: ['./akademska-godina.component.css']
})
export class AkademskaGodinaComponent implements OnInit {
  @Input('akademskaGodina') akademskaGodina: number;
  @Input('links') links: Link[];

  constructor() { }

  ngOnInit(): void {
  }

}
