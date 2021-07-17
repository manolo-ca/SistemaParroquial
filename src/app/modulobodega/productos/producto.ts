import { Almacen } from "../almacen/almacen";
import { Proveedor } from "../proveedores/proveedor";


export class Producto {
    prodId:number;
    prodNombre:string;
    prodCantidad:number;
    prodPrecio:number;
    prodDetalle:string;
    prodFkAlmacen:Almacen;
    prodFkProveedor:Proveedor;
    prodIva: Boolean;
    prodCategoria: string;
   

}
