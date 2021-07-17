import { Injectable } from '@angular/core';
import { Emisiondocumento } from './emisiondocumento';
import { Observable,throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map,catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class EmisiondocumentoService {

  private url_mater: string =environment.URL_BACKEND;

  
  private urlRead: string = 'http://'+this.url_mater+'/sj/emisiondocumento/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/emisiondocumento/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/emisiondocumento/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/emisiondocumento/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/emisiondocumento/buscar/';
  private urlSearchDocumento: string = 'http://'+this.url_mater+'/sj/emisiondocumento/searchid?filtro=';
  private urlFecha: string = 'http://'+this.url_mater+'/sj/emisiondocumento/searchFecha?';
  private urlFechaTipo: string = 'http://'+this.url_mater+'/sj/emisiondocumento/searchFechaTipo?';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient,private router: Router) { }

  getEmisionesDocumentos(): Observable<Emisiondocumento[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Emisiondocumento[])
    ).pipe(
      catchError(e => {
        swal.fire(
          'Error al Listar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  
  create(documento: Emisiondocumento): Observable<Emisiondocumento> {
    return this.http.post<Emisiondocumento>(this.urlCreate, documento, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Guardar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getEmisionDocumento(docuId): Observable<Emisiondocumento> {
    return this.http.get<Emisiondocumento>(`${this.urlSearch}/${docuId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al buscar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getEmisionDocumentoFechaDocumentos(fechauno, fechados): Observable<Emisiondocumento[]> {
    return this.http.get<Emisiondocumento[]>(`${this.urlFecha}filtrouno=${fechauno}&filtrodos=${fechados}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al buscar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  getEmisionDocumentoFechaDocumentosTipo(fechauno, fechados,tipodoc): Observable<Emisiondocumento[]> {
    return this.http.get<Emisiondocumento[]>(`${this.urlFechaTipo}filtrouno=${fechauno}&filtrodos=${fechados}&filtrotres=${tipodoc}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al buscar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  
  update(documento: Emisiondocumento): Observable<Emisiondocumento> {
    return this.http.put<Emisiondocumento>(`${this.urlUpdate}/${documento.emidId}`, 
    documento, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  delete(docuId: number): Observable<Emisiondocumento> {
    return this.http.delete<Emisiondocumento>(`${this.urlDelete}/${docuId}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
}
