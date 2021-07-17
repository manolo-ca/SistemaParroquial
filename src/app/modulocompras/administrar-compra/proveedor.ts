import { Persona } from '../../modulosp/registropersona/persona';
import { Compra } from './compra';

export class Proveedor {
   prov_id:number;
   prov_fk_persona:number;
   provFkPersona:Persona;
    compraCollection:Array<Compra>=[];
}
export class Proveedor2 {
    provId:number;
      provFkPersona: Persona; 
 }