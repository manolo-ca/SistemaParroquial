import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from './producto';
import { Proveedor } from './proveedor';
import { Inventario } from './inventario';
import { Compra } from './compra';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private url_mater: string =environment.URL_BACKEND;

  private urlEndpoint:string="http://"+this.url_mater+"/sj/compras/";
  private urlEndpointProducto:string="http://"+this.url_mater+"/sj/productos/";
  private urlEndpointInventario:string="http://"+this.url_mater+"/sj/inventarios/";


  constructor(private http:HttpClient) { }

  buscarProductoCompra(parametro:string):Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndpoint}/acproducto/${(parametro)}`);
  }
  buscarInventarioCompra(parametro:string):Observable<Inventario[]>{
    return this.http.get<Inventario[]>(`${this.urlEndpoint}/acinventario/${parametro}`);
  }
  buscarProveedorCompra(parametro:string):Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(`${this.urlEndpoint}/acproveedor/${parametro}`);
  }

  crearCompra(compra:Compra):Observable<Compra>{
    return this.http.post<Compra>(`${(this.urlEndpoint)}/guardar/`,compra);
  }
  sumarStock(idproducto,cantidad):Observable<Producto>{
    return this.http.get<Producto>(`${(this.urlEndpointProducto)}/sumastock/${(idproducto)}/${(cantidad)}`);
  }
  sumarStockInventario(idinventario,cantidad):Observable<Inventario>{
    return this.http.get<Inventario>(`${(this.urlEndpointInventario)}/sumastock/${(idinventario)}/${(cantidad)}`);
  }
  
  buscarfacturaCompra(idcompra:number):Observable<Compra>{
    return this.http.get<Compra>(`${(this.urlEndpoint)}/buscar/${(idcompra)}`);
  }
  
}