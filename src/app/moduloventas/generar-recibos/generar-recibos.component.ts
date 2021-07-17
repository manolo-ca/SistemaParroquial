import { Component, OnInit } from '@angular/core';
import { Recibo } from './generar-recibos';
import { ReciboService } from './generar-recibos.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-recibos',
  templateUrl: './generar-recibos.component.html',
})

export class GenerarRecibosComponent implements OnInit {

  validaboton:boolean=false;
  titulo:string='Recibo';
  recibo:Recibo=new Recibo();
  recibos:Recibo[];
  displayMaximizable:boolean;
  es:any;

  date :Date = new Date();

  
  constructor(private reciboService:ReciboService) { }

  ngOnInit() {
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"],
      dayNamesMin: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Deciembre" ],
      monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Agt", "Sep", "Oct", "Nov", "Dec" ],
      today: 'Hoy',
      clear: 'Borrar',
    };
    
    this.listarRecibos();
  }
  /* --------  OBTENER FECHA ACTUAL ----------- */
  getCuurentDate(): string {
    let today = new Date();
    let numbermounth = today.getUTCMonth() + 1;
    let mounth = '';
    let day = '';

    if (today.getDate() < 10) day = '0' + today.getUTCDate(); else day = today.getDate().toString();
    if (numbermounth < 10) mounth = '0' + numbermounth; else mounth = numbermounth.toString();

    return today.getFullYear() + '-' + mounth + '-' + day;
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  /* -------- REGISTRAR RECIBOS ------------ */
  crearRecibo(reciboForm):void{
    if (this.recibo.rcbValor!=null && this.recibo.rcbCliente !=null && this.recibo.rcbConcepto !=null && this.recibo.rcbdescripcionCantidad !=null && this.recibo.rcbValor!=0 && this.recibo.rcbCliente !="" && this.recibo.rcbConcepto !="" && this.recibo.rcbdescripcionCantidad !="" ) {
      this.recibo.rcbFechaemision=this.date;
      this.reciboService.guardarRecibo(this.recibo).subscribe(recibo=>{
        this.validaboton=true;
        Swal.fire({
          title: 'Recibo Guadado',
          text: "El recibo se guardo correctamente",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Imprimir'
        }).then((result) => {
          if (result.isConfirmed) {
            this.displayMaximizable = true;
          }else{
            this.listarRecibos();
          }
        })
        
      })
    }else{
      swal.fire(this.titulo,`Llene todos los Campos del Recibo`,'error');
    }
  }


  /* --------- GENERAR CODIGO DE RECIBO  -------------- */

  public listarRecibos(){
    this.recibo = new Recibo();
    let numero :number =0;
    this.reciboService.listarRecibos().subscribe(data=>{
      this.recibos=data;
      numero = this.recibos[this.recibos.length-1].rcbId + 1 ;
      if (this.recibos[this.recibos.length-1].rcbId>0 || this.recibos[this.recibos.length-1].rcbId<100) {
        this.recibo.rcbnumDocumento = "0000"+numero ;
      }
      if (this.recibos[this.recibos.length-1].rcbId>100) {
        this.recibo.rcbnumDocumento = "000"+numero;
      }
      if (this.recibos[this.recibos.length-1].rcbId>1000) {
        this.recibo.rcbnumDocumento = "00"+ numero;
      }
      if (this.recibos[this.recibos.length-1].rcbId>10000) {
        this.recibo.rcbnumDocumento = ""+ numero;
      }
    });
  }

  cerrarReporte(){
    this.displayMaximizable=false;
    this.listarRecibos();
  }

}
