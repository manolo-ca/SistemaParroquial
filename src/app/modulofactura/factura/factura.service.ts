import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from './producto';

import { Factura } from './factura';
import { Observable } from 'rxjs';
import { Cliente } from '../cliente/cliente';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private url_mater: string =environment.URL_BACKEND;

  private urlEndpoint:string="http://"+this.url_mater+"/sj/facturas/";

  private urlEndpointProducto:string="http://"+this.url_mater+"/sj/productos/";
  

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

}
