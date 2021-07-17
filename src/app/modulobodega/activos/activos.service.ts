import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable , throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Activos } from './activos';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ActivosService {

  private url_mater: string =environment.URL_BACKEND;

  private endpoint:string = 'http://'+this.url_mater+'/sj/activos';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http:HttpClient ) { }

  getActivo(actiId): Observable<Activos> {
    return this.http.get<Activos>(`${(this.endpoint)}/buscar/`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }


  crearActivo(activo:Activos):Observable<Activos>{
    return this.http.post<Activos>(`${(this.endpoint)}/guardar/`,activo);
  }

  listarActivo():Observable<Activos[]>{
    return this.http.get(`${(this.endpoint)}/listar/`).pipe(map(response => response as Activos[]));
  }

  editarActivo(servicio: Activos): Observable<Activos> {
    return this.http.put<Activos>(`${this.endpoint}/editar/${servicio.actiId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
 
  eliminarCapilla(actiId: number): Observable<Activos> {
    return this.http.delete<Activos>(`${this.endpoint}/borrar/${actiId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
 
}
