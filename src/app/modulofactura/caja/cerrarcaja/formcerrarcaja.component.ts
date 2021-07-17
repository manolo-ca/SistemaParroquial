import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { Caja } from '../caja';
import { CajaMovimiento } from '../caja-movimiento';
import { CajaService } from '../caja.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-formcerrarcaja',
  templateUrl: './formcerrarcaja.component.html',
  providers: [MessageService]
})


export class FormcerrarcajaComponent implements OnInit {

  /* --------  DECLARACION DE VARIABLES ----------- */
  montoapertura = '0,00';
  montocierre = '0,00';
  montoventas = '0,00';
  montocompras = '0,00';
  fechacierre: string;
  fechapertura: number;
  observacion = 'N/A';
  apertura: number;
  caja: Caja;
  movimientos: CajaMovimiento[];
  estadocaja: boolean;
  opcionesdrop: DropCajas[];
  selectedCaja: DropCajas;
  internetDate: string;
  internetTime: string;
  horacierre: string;

  /* -------- CONTRUCTOR DE LA CLASE ----------- */
  constructor(private cajaservice: CajaService, private messageService: MessageService) {
    this.estadocaja = true;
    this.internetDate = "";
    this.internetTime = "";
  }

  /* --------CARGA LAS CAJAS AL DROPDOWN----------- */
  ngOnInit() {
    this.cajaservice.getInternetDate().subscribe(
      data => {
        this.internetDate = data["datetime"].substring(0, 10);
        this.fechacierre = this.getDate(new Date(this.internetDate));
        this.internetTime = data["datetime"].substring(11, 16);
        this.horacierre = this.internetTime;
      }
    );
    this.cajaservice.getCaja().subscribe(
      data => {
        let option = new Array();
        for (let i = 0; i < data.length; i++) {
          option.push({ name: data[i].cajaNombre, code: data[i].cajaId });
        }
        this.opcionesdrop = option;
      }
    );
  }

  /* --------  VALIDA SI UN VALOR TIENE DECIMALES ----------- */
  validarEntero(valor: number) {
    var cadena;
    if (valor % 1 == 0) {
      cadena = valor + '.00'
    } else {
      cadena = valor.toString();
    }
    return cadena;
  }

  /* --------  CALCULA EL MONTO DE CIERRE ----------- */
  calcularMontoFinal(id: number) {
    let compras = 0;
    let ventas = 0;
    let gastos = 0
    var aux = 0;
    this.cajaservice.getMovimientosByCajaId(id).subscribe(
      data => {
        this.movimientos = data;
        var date1 = new Date(this.caja.cajaFechapertura);
        date1.setDate(date1.getDate() + 1);
        this.setHora(date1, this.caja.cajaHoraapertura);
        var date2;
        for (let i = 0; i < this.movimientos.length; i++) {
          if (this.movimientos[i].cajmEstado == "ACTIVO") {
            date2 = new Date(this.movimientos[i].cajmFecha);
            date2.setDate(date2.getDate() + 1);
            this.setHora(date2, this.movimientos[i].cajmHoraemisionDoc);
            console.log(date2, date1);
            if (date2 >= date1) {
              switch (this.movimientos[i].cajmTipo) {
                case 'COMPRA':
                  compras = compras + this.movimientos[i].cajmMonto;
                  break;
                case 'VENTA':
                  ventas = ventas + this.movimientos[i].cajmMonto;
                  break;
                case 'GASTO':
                  gastos = gastos + this.movimientos[i].cajmMonto;
                  break;
              }
            }
          }
        }
        this.montoventas = ventas.toFixed(2);
        this.montocompras = compras.toFixed(2);
        this.montocierre = ((this.apertura + ventas) - (compras + gastos)).toFixed(2);
      }
    )
  }

  /* --------  ACTUALIZA LA TABLA CAJA COMO CERRADO ----------- */
  updateCaja() {
    if (this.variableNula()) {
      let date = new Date(this.internetDate);
      date.setDate(date.getDate() + 1);
      let date2 = new Date(this.caja.cajaFechapertura);
      date2.setDate(date2.getDate() + 1);
      this.caja.cajaEstado = 'CERRADO';
      this.caja.cajaFechacierre = this.getDate(date);
      this.caja.cajaFechapertura = this.getDate(date2);
      this.caja.cajaHoracierre = this.internetTime;
      this.caja.cajaMontoapertura = parseFloat(this.montoapertura);
      this.caja.cajaObservaciones = this.observacion;
      this.caja.cajaMontocierre = parseFloat(this.montocierre);
      this.update(this.caja);
      this.messageService.clear();
    } else {
      this.showErrorDialog();
    }
  }

  /* --------  ACTUALIZA LA TABLA CAJA COMO CERRADO ----------- */
  setHora(date: Date, values: string) {
    let h = 0;
    let m = 0;
    let s = 0;
    try {
      h = parseInt(values.substring(0, 2));
      m = parseInt(values.substring(3, 5));
    } catch (error) {
    }
    date.setHours(h, m, s);
  }

  /* --------  REALIZA LA PETICION AL SERVICIO DE CAJA ----------- */
  public update(caja: Caja): void {
    if (this.estadocaja) {
      this.showInfoDialog();
    } else {
      this.cajaservice.update(this.caja, this.selectedCaja.code)
        .subscribe(cliente => {
          const swalWithBootstrapButtons = swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
            },
            buttonsStyling: false
          })
          swalWithBootstrapButtons.fire(
            'Info!',
            'Caja Cerrada en dia: '+this.internetDate+' '+this.internetTime+' Con: $'+this.montocierre,
            'success'
          )
        }
        );
      this.estadocaja = true;
    }
  }

  /* --------  OBTIENE LA FECHA EN FORMATO 'AAAA-MM-DD' ----------- */
  getDate(date: Date): string {
    let numbermounth = date.getMonth() + 1;
    date.setDate(date.getDate() + 1);
    let mounth = '';
    let day = '';
    if (date.getDate() < 10) day = '0' + date.getDate(); else day = date.getDate().toString();
    if (numbermounth < 10) mounth = '0' + numbermounth; else mounth = numbermounth.toString();
    return date.getFullYear() + '-' + mounth + '-' + day;
  }

  /* --------  MENSAJE CUANDO NO ESTA SELECCIONADA NINGUNA CAJA ----------- */
  showErrorDialog() {
    this.messageService.clear();
    setTimeout(() => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No ha seleccionado ninguna caja.' });
    }, 500);
  }

  /* --------  MENSAJE CUANDO CAJA ESTA CERRADA ----------- */
  showInfoDialog() {
    this.messageService.clear();
    setTimeout(() => {
      this.messageService.add({ severity: 'warn', summary: 'Informacion', detail: 'Caja ya se encuentra cerrada, boton deshabilitado.' });
    }, 500);
  }

  /* --------  MENSAJE CUANDO CAJA ESTA DISPONIBLE PARA CERRAR ----------- */
  showSucces() {
    this.messageService.clear();
    setTimeout(() => {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'Caja lista para cerrar' });
    }, 500);
    setTimeout(() => {
      this.messageService.clear();
    }, 1500);
  }

  /* -------- DETECTA LA SELECCION EN EL DROP DE CAJAS ----------- */
  OnChange(ev) {
    this.verificarEstadoCaja(ev.value.code);
  }

  /* --------  VERIFICA EL ESTADO DE CAJA ----------- */
  verificarEstadoCaja(id: number) {
    this.cajaservice.getCajaPorID(id)
      .subscribe(data => {
        this.caja = data;
        if (this.caja.cajaEstado == 'CERRADO') {
          this.estadocaja = true;
          this.montoapertura = '0,00';
          this.montocierre = '0,00';
          this.montoventas = '0,00';
          this.montocompras = '0,00';
          this.showInfoDialog();
        } else {
          this.estadocaja = false;
          this.fechapertura = Date.parse(this.caja.cajaFechapertura);
          this.apertura = this.caja.cajaMontoapertura;
          this.montoapertura = this.validarEntero(this.caja.cajaMontoapertura);
          this.calcularMontoFinal(id);
          this.showSucces();
        }
      }
      );
  }

  /* --------  VERIFICA QUE HAYA SELECCIONADO UNA CAJA ----------- */
  variableNula() {
    if (this.selectedCaja == null || this.selectedCaja == undefined) { return false } else { return true }
  }
}

interface DropCajas {
  name: string,
  code: number
}