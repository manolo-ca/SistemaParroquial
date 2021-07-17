import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from './producto';

import { Factura } from './factura';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Cliente } from 'src/app/modulofactura/cliente/cliente';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CajaMovimiento } from 'src/app/modulofactura/caja/caja-movimiento';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private url_mater: string =environment.URL_BACKEND;

  private urlEndpoint:string="http://"+this.url_mater+"/sj/facturas/";

  private urlEndpointReports:string="http://"+this.url_mater+"/reports/";

  private urlEndpointProducto:string="http://"+this.url_mater+"/sj/productos/";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  private urlSearchCedula: string = 'http://'+this.url_mater+'/sj/personas/searchCedulaCliente?filtro=';

  constructor(private http:HttpClient) { }

  buscarProductoFactura(parametro:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndpoint}/acproducto/${parametro}`);
  }

  buscarClienteFactura(parametro:string):Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${(this.urlEndpoint)}/accliente/${parametro}`);
  }

  crearFactura(factura:Factura):Observable<Factura>{
    return this.http.post<Factura>(`${(this.urlEndpoint)}/guardar/`,factura);
  }

  actualizarStock(idproducto,cantidad):Observable<Producto>{
    return this.http.get<Producto>(`${(this.urlEndpointProducto)}/updstock/${(idproducto)}/${(cantidad)}`);
  }

  buscarfacturaVenta(idfactura:number):Observable<Factura>{
    return this.http.get<Factura>(`${(this.urlEndpoint)}/buscar/${(idfactura)}`);
  }

  deleteFactura(tipdId: number): Observable<Factura> {
    return this.http.delete<Factura>(`${this.urlEndpoint}/borrar/${tipdId}`, { headers: this.httpHeaders }) .pipe(
      catchError(e => {
        Swal.fire(
          'Error al Eliminar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getFactura(tipdId): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndpoint}/buscar/${tipdId}`).pipe(
      catchError(e => {
        Swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getCajaMovimiento(tipo,idfactura): Observable<CajaMovimiento> {
    return this.http.get<CajaMovimiento>(`${this.urlEndpointReports}${tipo}/${idfactura}`).pipe(
      catchError(e => {
        Swal.fire(
          'Error al Cargar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  updateFactura(servicio: Factura): Observable<Factura> {
    return this.http.put<Factura>(`${this.urlEndpoint}/editar/${servicio.factId}`, servicio, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire(
          'Error al Actualizar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  getFacturas(): Observable<Factura[]> {
    return this.http.get(`${this.urlEndpoint}/listar/`).pipe(
      map(response => response as Factura[])
    );
  }

  getFacturalastinsertId():Observable<number>{
    return this.http.get<number>(`${this.urlEndpoint}/maxidfactura`);
  }

  getBuscaPersona(persCedula): Observable<any> {
    return this.http.get<any>(`${this.urlSearchCedula}${persCedula}`).pipe(
      catchError(e => {
        "error"
        return throwError(e);
      })
    );
    
  }

}
