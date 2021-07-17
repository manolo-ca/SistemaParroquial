import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ReciboService } from '../recibo.service';
import { Recibo } from '../recibo';
@Component({
  selector: 'app-formrecibo',
  templateUrl: './formrecibo.component.html',
})
export class FormreciboComponent implements OnInit {

  validaboton:boolean=false;
  titulo:string='Recibo';
  recibo:Recibo=new Recibo();
  recibos:Recibo[];
  displayMaximizable:boolean;
  es:any;
  
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
  this.recibo.rcbFechaemision=this.getCuurentDate();
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
      if (reciboForm.form.valid) {
  
        swal.fire({
          title:this.titulo,
          text:'¿Desea emitir el siguiente Recibo?',
          showCancelButton: true,
          confirmButtonText: `Confirmar`,
          denyButtonText: `Cancelar`,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.reciboService.guardarRecibo(this.recibo).subscribe(recibo=>{
              swal.fire(this.titulo,`Recibo Nro ${recibo.rcbnumDocumento} creado con exito`,'success');
              this.validaboton=true;
            })
          } else if (result.isDenied) {
            this.validaboton=true;
            result.dismiss === swal.DismissReason.cancel
          }
        })
  
    }else{
      swal.fire(this.titulo,`Llene todos los Campos del Recibo`,'error');
    }
  }

    /* --------- CARGAR IMPRESION RECIBO ----------- */
    public getRecibo(){
       if(this.recibo.rcbValor>0){
        this.displayMaximizable = true;
       }
    }

}
