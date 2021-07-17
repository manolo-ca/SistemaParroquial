import { Injectable } from '@angular/core';
import { Servicio } from './servicio';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/servicio/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/servicio/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/servicio/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/servicio/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/servicio/buscar/';
  private httpHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json'
    })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable<Servicio[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Servicio[])
    );
  }

  create(cliente: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.urlCreate, cliente,
      { headers: this.httpHeaders }).pipe(
        catchError(e => {
          swal.fire(
            'Error al Guardar', 'Error al listar', 'error'
          );
          return throwError(e);
        })
      );

  }

  getServicio(servId): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlSearch}/${servId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', 'Error al Cargar', 'error'
        );
        return throwError(e);
      })
    );
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.urlUpdate}/${servicio.servId}`,
      servicio, { headers: this.httpHeaders }).pipe(
        catchError(e => {
          swal.fire(
            'Error al editar', 'Hubo un error al editar', 'error'
          );
          return throwError(e);
        })
      );
  }

  delete(servId: number): Observable<Servicio> {
    return this.http.delete<Servicio>(`${this.urlDelete}/${servId}`,
      { headers: this.httpHeaders }).pipe(
        catchError(e => {
          swal.fire(
            'Error al eliminar', 'No se puede eliminar', 'error'
          );
          return throwError(e);
        })
      );
  }
}
