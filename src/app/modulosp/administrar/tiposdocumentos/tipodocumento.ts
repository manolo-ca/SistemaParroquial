import { Servicio } from '../servicioslista/servicio';
export class Tipodocumento {
    tipdId:number;
    tipdNombre:string;
    tipdDescripcion: string;
    tipdValor:number;
    tipdFkServicio:Servicio
}
