import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'

})
export class ApiService {
  private apiurl:string;

  getTestni(){
    return this.http.get(this.apiurl + '/testni').pipe(
      map((data:any[]) => {
        console.log(data);
        const [linkovi, akademskeGod, izmjeneNastProgZaDan, izmjeneNastProg] = data;
        return {
          linkovi: linkovi.filter(l => !l.href.endsWith('.html')).map(link => link.href),
          akademskeGod: akademskeGod._embedded.akademskeGodine.map(ag => {
            return {
              akademskaGodina: ag.akademskaGodina,
              links: Object.keys(ag._links).map(key => {
                return {
                  label: key.split('_').join(' '),
                  link: ag._links[key].href
                }
              })
            }
          }),
          izmjeneNastProgZaDan: Object.keys(izmjeneNastProgZaDan._links).map(key => {
            if(key != "profile" && key != "self") {
              return{
                label: key.split('_').join(' '),
                link:  izmjeneNastProgZaDan._links[key].href
              }
            } else {
              return null;
            }
          }).filter(item => item != null),
          izmjeneNastProg: Object.keys(izmjeneNastProg._links).map(key => {
            if(key != "profile" && key != "self") {
              return{
                label: key.split('_').join(' '),
                link:  izmjeneNastProg._links[key].href
              }
            } else {
              return null;
            }
          }).filter(item => item != null),
        };
        return data;
      }),
      catchError(err => {
        console.error(err);
        return err;
      })
    )
  }
  constructor(private http:HttpClient) {
    this.apiurl="http://localhost:8090/api"

   }
}
