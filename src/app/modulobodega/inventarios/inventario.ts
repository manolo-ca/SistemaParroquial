import { Activos } from "../activos/activos";
import { Almacen } from "../almacen/almacen";

export class Inventario {
     inveId:number;
     inveNombre:string;
     inveCantidad: number;
     invePrecio: number;
     inveDetalle: string;
     inveFkActivo: Activos;
     inveFkAlmacen: Almacen;
}
