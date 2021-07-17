import { Activos } from "../../modulobodega/activos/activos";
import { Almacen } from "../../modulobodega/almacen/almacen";
export class Inventario {
    inveId:number;
    inveNombre:string;
    inveCantidad:number;
    invePrecio:number=0.00;
    inveDetalle:string;
    inveNroExistencias:number;
}
export class Inventario2 {
    inveId:number;
    inveNombre:string;
    inveCantidad: number;
    invePrecio: number;
    inveDetalle: string;
    inveFkActivo: Activos;
    inveFkAlmacen: Almacen;
}

