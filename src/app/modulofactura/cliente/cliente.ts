import { Persona } from '../../modulosp/registropersona/persona';
import { Factura } from '../factura/factura';


export class Cliente {
    clieId:number;
    clieEstado:string="ACTIVO";
    clieFkPersona:Persona;
    facturaCollection:Array<Factura>=[];
}