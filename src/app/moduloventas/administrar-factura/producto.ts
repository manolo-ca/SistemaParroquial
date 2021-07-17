import { Almacen } from "src/app/modulobodega/almacen/almacen";

export class Producto {
    prodId:number;
    prodNombre:string;
    prodCantidad:number;
    prodPrecio:number;
    prodDetalle:string;
    prodIva: Boolean;
    prodFkAlmacen: Almacen;
}
