import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { Producto } from './producto';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url_mater: string =environment.URL_BACKEND;

  private endpoint:string = 'http://'+this.url_mater+'/sj/productos';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http:HttpClient) 
  { }

  getProducto(prodId): Observable<Producto> {
    return this.http.get<Producto>(`${(this.endpoint)}/buscar/${prodId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  getProductosAlmacen(prodId): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${(this.endpoint)}/productosAlmacen/?filtro=${prodId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getProductosAlmacenCapilla(capi_id): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${(this.endpoint)}/productosAlmacenCapilla/?filtro=${capi_id}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  crearProducto(producto:Producto):Observable<Producto>{
    return this.http.post<Producto>(`${(this.endpoint)}/guardar/`,producto);
  }

  listarProducto():Observable<Producto[]>{
    return this.http.get(`${(this.endpoint)}/listar/`).pipe(map(response => response as Producto[]));
  }

  editarProducto(servicio: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.endpoint}/editar/${servicio.prodId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  eliminarProducto(prodId: number): Observable<Producto> {
    return this.http.delete<Producto>(`${this.endpoint}/borrar/${prodId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
}
