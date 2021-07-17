import { Usuario } from '../../login/login';
export class Caja {
    cajaId:number;
    cajaFechapertura:string;
    cajaFechacierre:string;
    cajaMontoapertura:number;
    cajaMontocierre:number;
    cajaObservaciones:string;
    cajaEstado:string;
    cajaNombre:string;
    cajaHoraapertura:string;
    cajaHoracierre:string;
    cajaFkUsuario:Usuario
}