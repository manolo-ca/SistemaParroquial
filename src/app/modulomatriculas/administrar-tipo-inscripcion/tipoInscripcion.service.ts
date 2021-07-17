import { Injectable } from '@angular/core';
import { tipoInscripcion } from './tipoInscripcion';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class tipoInscripcionService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/tiposinscripciones/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/tiposinscripciones/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/tiposinscripciones/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/tiposinscripciones/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/tiposinscripciones/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getTipoInscripciones(): Observable<tipoInscripcion[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as tipoInscripcion[])
    );
  }

  create(cliente: tipoInscripcion): Observable<tipoInscripcion> {
    return this.http.post<tipoInscripcion>(this.urlCreate, cliente,
      { headers: this.httpHeaders })
  }

  getTipoInscripcionesId(tipiId): Observable<tipoInscripcion> {
    return this.http.get<tipoInscripcion>(`${this.urlSearch}/${tipiId}`)
  }servicio

  update(tipoinscripcion: tipoInscripcion): Observable<tipoInscripcion> {
    return this.http.put<tipoInscripcion>(`${this.urlUpdate}/${tipoinscripcion.tipiId}`,
    tipoinscripcion, { headers: this.httpHeaders })
  }

  delete(tipoinscripcion: number): Observable<tipoInscripcion> {
    return this.http.delete<tipoInscripcion>(`${this.urlDelete}/${tipoinscripcion}`,
      { headers: this.httpHeaders })
  }
}
