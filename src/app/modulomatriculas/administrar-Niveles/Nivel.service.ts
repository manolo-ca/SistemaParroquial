import { Injectable } from '@angular/core';
import { Nivel} from './Nivelservicio';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class administarnivelservice {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/nivel/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/nivel/guardar';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/nivel/borrar';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/nivel/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/nivel/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable< Nivel[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as  Nivel[])
    );
  }

  create(nivel:  Nivel): Observable< Nivel> {
    return this.http.post< Nivel>(this.urlCreate, nivel,
      { headers: this.httpHeaders })
  }

  getServicio(codigo): Observable< Nivel> {
    return this.http.get< Nivel>(`${this.urlSearch}/${codigo}`)
  }

  update( Nivel:  Nivel): Observable< Nivel> {
    return this.http.put< Nivel>(`${this.urlUpdate}/${ Nivel.niveId}`,
    Nivel, { headers: this.httpHeaders })
  }

  delete(codigo: number): Observable< Nivel> {
    return this.http.delete< Nivel>(`${this.urlDelete}/${codigo}`,
      { headers: this.httpHeaders })
  }
}
