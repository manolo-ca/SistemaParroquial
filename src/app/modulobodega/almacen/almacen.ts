import { Capilla } from "../capillas/capilla";
import { Producto } from "../productos/producto";

export class Almacen {
    almaId: number;
    almaNombre: string="";
    almaVenta: boolean;
    almaFkCapilla: Capilla;
}
