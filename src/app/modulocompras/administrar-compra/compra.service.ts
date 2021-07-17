import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from './producto';
import { Proveedor } from './proveedor';
import { Inventario } from './inventario';
import { Compra } from './compra';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class CompraService {

  private url_mater: string = environment.URL_BACKEND;

  private urlEndpoint: string = "http://" + this.url_mater + "/sj/compras/";
  private urlEndpointProducto: string = "http://" + this.url_mater + "/sj/productos/";
  private urlEndpointInventario: string = "http://" + this.url_mater + "/sj/inventarios/";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })


  constructor(private http: HttpClient) { }

  buscarProductoCompra(parametro: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/acproducto/${(parametro)}`);
  }
  buscarInventarioCompra(parametro: string): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.urlEndpoint}/acinventario/${parametro}`);
  }
  buscarProveedorCompra(parametro: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.urlEndpoint}/acproveedor/${parametro}`);
  }

  anulacionCompra(parametro: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.urlEndpoint}/buscar/${parametro}`);
  }

  crearCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(`${(this.urlEndpoint)}/guardar/`, compra);
  }

  sumarStock(idproducto, cantidad): Observable<Producto> {
    return this.http.get<Producto>(`${(this.urlEndpointProducto)}/sumastock/${(idproducto)}/${(cantidad)}`);
  }
  actualizarStock(idproducto, cantidad): Observable<Producto> {
    return this.http.get<Producto>(`${(this.urlEndpointProducto)}/updstock/${(idproducto)}/${(cantidad)}`);
  }
  sumarStockInventario(idinventario, cantidad): Observable<Inventario> {
    return this.http.get<Inventario>(`${(this.urlEndpointInventario)}/sumastock/${(idinventario)}/${(cantidad)}`);
  }

  buscarfacturaCompra(idcompra: number): Observable<Compra> {
    return this.http.get<Compra>(`${(this.urlEndpoint)}/buscar/${(idcompra)}`);
  }

  deleteCompra(id: number): Observable<Compra> {
    return this.http.delete<Compra>(`${this.urlEndpoint}/borrar/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }
  
  getCompra(id): Observable<Compra> {
    return this.http.get<Compra>(`${this.urlEndpoint}/buscar/${id}`).pipe(
      catchError(e => {
        Swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  updateCompra(servicio: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.urlEndpoint}/editar/${servicio.compId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getCompras(): Observable<Compra[]> {
    return this.http.get(`${this.urlEndpoint}/listar/`).pipe(
      map(response => response as Compra[])
    );
  }

}