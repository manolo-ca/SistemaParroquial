import { Injectable } from '@angular/core';
import { Dirigentes } from './Dirigenteservicio';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class administardirigenteservice {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/dirigentes/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/dirigentes/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/dirigentes/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/dirigentes/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/dirigentes/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable<Dirigentes[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Dirigentes[])
    );
  }

  create(cliente: Dirigentes): Observable<Dirigentes> {
    return this.http.post<Dirigentes>(this.urlCreate, cliente,
      { headers: this.httpHeaders })
  }

  getServicio(codigo): Observable<Dirigentes> {
    return this.http.get<Dirigentes>(`${this.urlSearch}/${codigo}`)
  }

  update(Aula: Dirigentes): Observable<Dirigentes> {
    return this.http.put<Dirigentes>(`${this.urlUpdate}/${Aula.dirigenteId}`,
    Aula, { headers: this.httpHeaders })
  }

  delete(codigo: number): Observable<Dirigentes> {
    return this.http.delete<Dirigentes>(`${this.urlDelete}/${codigo}`,
      { headers: this.httpHeaders })
  }
}
