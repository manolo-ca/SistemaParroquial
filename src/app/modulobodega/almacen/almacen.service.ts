import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { Almacen } from './almacen';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private url_mater: string =environment.URL_BACKEND;

  private endpoint:string = 'http://'+this.url_mater+'/sj/almacenes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) {

  }

  getAlmacen(almaId): Observable<Almacen> {
    return this.http.get<Almacen>(`${(this.endpoint)}/buscar/`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  crearAlmacen(almacen:Almacen):Observable<Almacen>{
    return this.http.post<Almacen>(`${(this.endpoint)}/guardar/`,almacen);
  }

  listarAlmacen():Observable<Almacen[]>{
    return this.http.get(`${(this.endpoint)}/listar/`).pipe(map(response => response as Almacen[]));
  }

  editarAlmacen(servicio: Almacen): Observable<Almacen> {
    return this.http.put<Almacen>(`${this.endpoint}/editar/${servicio.almaId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  eliminarAlmacen(almaId: number): Observable<Almacen> {
    return this.http.delete<Almacen>(`${this.endpoint}/borrar/${almaId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

}
