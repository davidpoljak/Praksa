import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  data: any;
  constructor(private api:ApiService) {}
  ngOnInit() {
    this.api.getTestni().subscribe((data:any) => {
      this.data = data;
      console.log(data);
      
    }, err => {}
    );
  }

}
