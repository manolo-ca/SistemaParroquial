import { Injectable } from '@angular/core';
import {Periodo} from './Periodoservicio';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AdministrarPeriodoComponentservice {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/periodo/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/periodo/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/periodo/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/periodo/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/periodo/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable< Periodo[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as  Periodo[])
    );
  }

  create(cliente:  Periodo): Observable<Periodo> {
    return this.http.post< Periodo>(this.urlCreate, cliente,
      { headers: this.httpHeaders })
  }

  getServicio(codigo): Observable< Periodo> {
    return this.http.get< Periodo>(`${this.urlSearch}/${codigo}`)
  }

  update( Periodo:  Periodo): Observable< Periodo> {
    return this.http.put< Periodo>(`${this.urlUpdate}/${ Periodo.periId}`,
    Periodo, { headers: this.httpHeaders })
  }

  delete(codigo: number): Observable< Periodo> {
    return this.http.delete< Periodo>(`${this.urlDelete}/${codigo}`,
      { headers: this.httpHeaders })
  }
}
