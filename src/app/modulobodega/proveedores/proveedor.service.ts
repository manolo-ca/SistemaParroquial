import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Proveedor } from './proveedor';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private url_mater: string =environment.URL_BACKEND;

  private endpoint:string = 'http://'+this.url_mater+'/sj/proveedores';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http:HttpClient) { }

  getProveedor(provId): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${(this.endpoint)}/buscar/`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }


  crearProveedor(proveedor:Proveedor):Observable<Proveedor>{
    return this.http.post<Proveedor>(`${(this.endpoint)}/guardar/`,proveedor);
  }

  listarProveedor():Observable<Proveedor[]>{
    return this.http.get(`${(this.endpoint)}/listar/`).pipe(map(response => response as Proveedor[]));
  }
  editarProveedor(servicio: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.endpoint}/editar/${servicio.provId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  eliminarProveedor(provId: number): Observable<Proveedor> {
    return this.http.delete<Proveedor>(`${this.endpoint}/borrar/${provId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
}
