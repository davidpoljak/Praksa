import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { HttpClient } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { AkademskaGodinaComponent } from './akademska-godina/akademska-godina.component';
import { IzmjeneNastProgComponent } from './izmjene-nast-prog/izmjene-nast-prog.component';
import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    AkademskaGodinaComponent,
    IzmjeneNastProgComponent,
  ],
  imports: [
    CardModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
