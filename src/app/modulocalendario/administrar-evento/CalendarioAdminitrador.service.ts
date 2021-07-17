import { Injectable } from '@angular/core';
import {Calendario} from './CalendarioAdministrador';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AdministrarCalendarioComponentservice {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/calendario/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/calendario/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/calendario/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/calendario/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/calendario/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable< Calendario[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as  Calendario[])
    );
  }

  create(cliente:  Calendario): Observable<Calendario> {
    return this.http.post< Calendario>(this.urlCreate, cliente,
      { headers: this.httpHeaders })
  }

  getServicio(codigo): Observable< Calendario> {
    return this.http.get< Calendario>(`${this.urlSearch}/${codigo}`)
  }

  update( Periodo:  Calendario): Observable< Calendario> {
    return this.http.put< Calendario>(`${this.urlUpdate}/${ Periodo.caleId}`,
    Periodo, { headers: this.httpHeaders })
  }

  delete(codigo: number): Observable< Calendario> {
    return this.http.delete< Calendario>(`${this.urlDelete}/${codigo}`,
      { headers: this.httpHeaders })
  }
}
