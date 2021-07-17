import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CursilloBautizo } from './administrarcbautizo';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CursilloBautizoService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/cursillob/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/cursillob/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/cursillob/borrar';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/cursillob/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/cursillob/buscar';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getCursillos(): Observable<CursilloBautizo[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as CursilloBautizo[])
    );
  }

  createCursillo(cursillo: CursilloBautizo): Observable<CursilloBautizo> {
    return this.http.post<CursilloBautizo>(this.urlCreate, cursillo,
      { headers: this.httpHeaders })
  }

  getCursillo(codigo): Observable<CursilloBautizo> {
    return this.http.get<CursilloBautizo>(`${this.urlSearch}/${codigo}`)
  }

  updateCursillo(cursillo: CursilloBautizo): Observable<CursilloBautizo> {
    return this.http.put<CursilloBautizo>(`${this.urlUpdate}/${cursillo.cursbId}`,
    cursillo, { headers: this.httpHeaders })
  }

  deleteCursillo(id: number): Observable<CursilloBautizo> {
    return this.http.delete<CursilloBautizo>(`${this.urlDelete}/${id}`,
      { headers: this.httpHeaders })
  }
}
