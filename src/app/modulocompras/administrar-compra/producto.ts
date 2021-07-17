import { Almacen } from "../../modulobodega/almacen/almacen";
import { Proveedor,Proveedor2 } from "./proveedor";
export class Producto {
    prodId:number;
    prodNombre:string;
    prodCantidad:number;
    prodPrecio:number;
    prodDetalle:string;
    prodNroExistencias:number;
    prodIva: Boolean;
   
}

export class Producto2 {
    prodId:number;
     prodNombre:string;
     prodCantidad:number;
     prodPrecio:number;
     prodDetalle:string;
     prodFkAlmacen:Almacen;
     prodFkProveedor:Proveedor2;
     prodIva: Boolean;
     prodCategoria: string;
    
 
 }