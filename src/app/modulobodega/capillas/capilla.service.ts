import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { Capilla } from './capilla';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CapillaService {

  private url_mater: string =environment.URL_BACKEND;

  private endpoint:string = 'http://'+this.url_mater+'/sj/capillas';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) { 
    
  }

  getCapilla(capiId): Observable<Capilla> {
    return this.http.get<Capilla>(`${(this.endpoint)}/buscar/`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  crearCapilla(capilla:Capilla):Observable<Capilla>{
    return this.http.post<Capilla>(`${(this.endpoint)}/guardar/`,capilla);
  }

  listarCapilla():Observable<Capilla[]>{
    return this.http.get(`${(this.endpoint)}/listar/`).pipe(map(response => response as Capilla[]));
  }

  editarCapilla(servicio: Capilla): Observable<Capilla> {
    return this.http.put<Capilla>(`${this.endpoint}/editar/${servicio.capiId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  eliminarCapilla(capiId: number): Observable<Capilla> {
    return this.http.delete<Capilla>(`${this.endpoint}/borrar/${capiId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

}
