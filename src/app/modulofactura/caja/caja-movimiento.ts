import { Caja } from './caja';

export class CajaMovimiento {
    cajmId:number;
    cajmEstado:string;
    cajmTipo:string;
    cajmFecha:string;
    cajmMonto:number;
    cajmObservaciones:string;
    cajmFkCaja:Caja;
    cajmIdDoc:number;
    cajmNumDoc:string;
    cajmHoraemisionDoc:string;
}
