import { Injectable } from '@angular/core';
import { Tipodocumento } from './tipodocumento';
import { Observable ,throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/tipodocumento/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/tipodocumento/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/tipodocumento/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/tipodocumento/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/tipodocumento/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getTiposDocumentos(): Observable<Tipodocumento[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Tipodocumento[])
    );
  }

  create(tiposDocumentos: Tipodocumento): Observable<Tipodocumento> {
    return this.http.post<Tipodocumento>(this.urlCreate, tiposDocumentos, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Guardar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getTipoDocumento(tipdId): Observable<Tipodocumento> {
    return this.http.get<Tipodocumento>(`${this.urlSearch}/${tipdId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  update(servicio: Tipodocumento): Observable<Tipodocumento> {
    return this.http.put<Tipodocumento>(`${this.urlUpdate}/${servicio.tipdId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  delete(tipdId: number): Observable<Tipodocumento> {
    return this.http.delete<Tipodocumento>(`${this.urlDelete}/${tipdId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
}
