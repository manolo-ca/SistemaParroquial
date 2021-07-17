import { Component, OnInit } from '@angular/core';
import { Recibo } from './recibo';
import { ReciboService } from './recibo.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html'
})
export class ReciboComponent implements OnInit {

  validaboton:boolean=false;
  titulo:string='Recibo';
  recibo:Recibo=new Recibo();
  recibos:Recibo[];
  displayMaximizable:boolean;
  es:any;
  
  constructor(private reciboService:ReciboService) { }

  ngOnInit() {

    this.listarRecibos();
  }


  /* --------- LISTAR RECIBOS  -------------- */

  public listarRecibos(){
    this.reciboService.listarRecibos().subscribe(recibos=>this.recibos=recibos);
  }


  /* --------- BUCAR RECIBO ----------- */
  public getRecibo(rcb:Recibo){
    this.reciboService.buscarRecibo(rcb.rcbId).subscribe(data=>{this.recibo=data});
    console.log(this.recibo);
    this.displayMaximizable = true;
  }

  /* ----  ELIMINAR RECIBO ------------ */
  public eliminarRecibo(rcb:Recibo){
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar este Recibo?',
      text: `¡No podrás revertir esto! Eliminar`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.reciboService.eliminarRecibo(rcb.rcbId).subscribe(
          response => {
            swalWithBootstrapButtons.fire(
              'Eliminado',
              `Recibo Nro: ${rcb.rcbnumDocumento} eliminado Satisfactoriamente`,
              'success'
            )
         this.listarRecibos();
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Su registro no se elimino :)',
          'error'
        )
      }
    })
  }



}