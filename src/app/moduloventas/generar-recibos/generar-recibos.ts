export class Recibo {
    rcbId:number;
    rcbnumDocumento:string;
    rcbCliente:string;
    rcbdescripcionCantidad:string;
    rcbConcepto:string;
    rcbFechaemision:Date;
    rcbValor:number=0;
    rcbEstado:string="ACTIVO";
}
