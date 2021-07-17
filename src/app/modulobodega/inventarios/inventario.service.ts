import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { map, catchError}  from 'rxjs/operators';
import { Inventario } from './inventario';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private url_mater: string =environment.URL_BACKEND;

  private endpoint:string = 'http://'+this.url_mater+'/sj/inventarios';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http:HttpClient) { }

  getInventario(inveId): Observable<Inventario> {
    return this.http.get<Inventario>(`${(this.endpoint)}/buscar/`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  getInventarioAlmacen(inveId): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${(this.endpoint)}/listarAlmacenInventario/?filtro=${inveId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  crearInventario(inventario:Inventario):Observable<Inventario>{
    return this.http.post<Inventario>(`${(this.endpoint)}/guardar/`,inventario);
  }

  listarInventario():Observable<Inventario[]>{
    return this.http.get(`${(this.endpoint)}/listar/`).pipe(map(response => response as Inventario[]));
  }

  editarInventario(servicio: Inventario): Observable<Inventario>{
    return this.http.put<Inventario>(`${this.endpoint}/editar/${servicio.inveId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  eliminarInventario(inveId: number): Observable<Inventario> {
    return this.http.delete<Inventario>(`${this.endpoint}/borrar/${inveId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
}
