import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CursilloMatrimonio } from './administrarcmatrimonio';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CursilloMatrimonioService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/cursillom/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/cursillom/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/cursillom/borrar';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/cursillom/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/cursillom/buscar';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getCursillos(): Observable<CursilloMatrimonio[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as CursilloMatrimonio[])
    );
  }

  createCursillo(cursillo: CursilloMatrimonio): Observable<CursilloMatrimonio> {
    return this.http.post<CursilloMatrimonio>(this.urlCreate, cursillo,
      { headers: this.httpHeaders })
  }

  getCursillo(codigo): Observable<CursilloMatrimonio> {
    return this.http.get<CursilloMatrimonio>(`${this.urlSearch}/${codigo}`)
  }

  updateCursillo(cursillo: CursilloMatrimonio): Observable<CursilloMatrimonio> {
    return this.http.put<CursilloMatrimonio>(`${this.urlUpdate}/${cursillo.cursmId}`,
    cursillo, { headers: this.httpHeaders })
  }

  deleteCursillo(id: number): Observable<CursilloMatrimonio> {
    return this.http.delete<CursilloMatrimonio>(`${this.urlDelete}/${id}`,
      { headers: this.httpHeaders })
  }
}
