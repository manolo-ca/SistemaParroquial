import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Caja } from '../caja';
import { CajaService } from '../caja.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-formaperturarcaja',
  templateUrl: './formaperturarcaja.component.html',
  providers: [MessageService]
})
export class FormaperturarcajaComponent implements OnInit {

  /* -------- DECLARACION DE VARIABLES ----------- */
  observacion = 'N/A';
  montoapertura = '0.00';
  horaapertura: string;
  fechaapertura: string;
  cajas: Caja[];
  estadocaja: boolean;
  caja: Caja;
  opcionesdrop: DropCajas[];
  selectedCaja: DropCajas;
  internetDate: string;
  internetTime: string;

  /* -------- CONSTRUCTOR DE LA CLASE ----------- */
  constructor(private messageService: MessageService,
    private cajamservice: CajaService) {
    this.estadocaja = true;
    this.internetDate = "";
    this.internetTime = "";
  }

  /* --------CARGA LAS CAJAS AL DROPDOWN----------- */
  ngOnInit() {
    this.cajamservice.getInternetDate().subscribe(
      data => {
        this.internetDate = data["datetime"].substring(0, 10);
        this.fechaapertura = this.getDate(new Date(this.internetDate));
        this.internetTime = data["datetime"].substring(11, 16);
        this.horaapertura = this.internetTime
      }
    );
    this.cajamservice.getCaja().subscribe(
      data => {
        this.cajas = data;
        let option = new Array();
        for (let i = 0; i < data.length; i++) {
          option.push({ name: data[i].cajaNombre, code: data[i].cajaId });
        }
        this.opcionesdrop = option;
      }
    );
  }

  /* --------  VALIDA SI EL VALOR TIENE DECIMALES ----------- */
  validarEntero(valor: number) {
    var cadena;
    if (valor % 1 == 0) {
      cadena = valor + '.00'
    } else {
      cadena = valor.toString();
    }
    return cadena;
  }

  /* --------  OBTIENE LA FECHA EN FORMATO 'AAAA-MM-DD' ----------- */
  getDate(date: Date): string {
    date.setDate(date.getDate() + 1);
    let numbermounth = date.getMonth() + 1;
    let mounth = '';
    let day
    if (date.getDate() < 10) day = '0' + date.getDate(); else day = date.getDate().toString();
    if (numbermounth < 10) mounth = '0' + numbermounth; else mounth = numbermounth.toString();
    return date.getFullYear() + '-' + mounth + '-' + day;
  }

  /* --------  ACTUALIZA EL ESTADO DE CAJA ----------- */
  updateCaja() {
    if (this.variableNula()) {
      let date = new Date(this.internetDate);
      date.setDate(date.getDate() + 1);
      this.caja.cajaEstado = 'ABIERTO';
      this.caja.cajaFechapertura = this.getDate(date);
      this.caja.cajaHoraapertura = this.internetTime;
      this.caja.cajaMontoapertura = parseFloat(this.montoapertura);
      this.caja.cajaMontocierre = parseFloat(this.montoapertura);
      this.caja.cajaObservaciones = this.observacion;
      this.caja.cajaFechacierre = null;
      this.update(this.caja, this.selectedCaja.code);
      this.messageService.clear();
    } else {
      this.showErrorDialog();
    }
  }

  /* --------  ENVIA LOS CAMBIOS DE CAJA AL BACKEND ----------- */
  public update(caja: Caja, id: number): void {
    if (this.estadocaja) {
      this.showInfoDialog();
    } else {
      this.cajamservice.update(this.caja, id)
        .subscribe(cliente => {
          const swalWithBootstrapButtons = swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
            },
            buttonsStyling: false
          })
          swalWithBootstrapButtons.fire(
            'Info!',
            'Caja Abierta en dia: '+this.internetDate+' '+this.internetTime+' Con: $'+this.montoapertura,
            'success'
          )
        }
        );
      this.estadocaja = true;
    };
  }

  /* --------  MENSAJE CUANDO NO ESTA SELECCIONADA NINGUNA CAJA ----------- */
  showErrorDialog() {
    this.messageService.clear();
    setTimeout(() => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No ha seleccionado ninguna caja.' });
    }, 500);
  }

  /* --------  MENSAJE CUANDO CAJA ESTA ABIERTA ----------- */
  showInfoDialog() {
    this.messageService.clear();
    setTimeout(() => {
      this.messageService.add({ severity: 'warn', summary: 'Informacion', detail: 'Caja ya se encuentra abierta, boton deshabilitado.' });
    }, 500);
  }

  /* --------  MENSAJE CUANDO CAJA ESTA DISPONIBLE PARA ABRIR ----------- */
  showSucces() {
    this.messageService.clear();
    setTimeout(() => {
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'Caja lista para abrir' });
    }, 500);
    setTimeout(() => {
      this.messageService.clear();
    }, 1500);
  }

  /* -------- DETECTA LA SELECCION EN EL DROP DE CAJAS ----------- */
  OnChange(ev) {
    this.verificarEstadoCaja(ev.value.code)
  }

  /* --------  VERIFICA EL ESTADO DE CAJA ----------- */
  verificarEstadoCaja(id: number) {
    this.cajamservice.getCajaPorID(id)
      .subscribe(data => {
        this.caja = data;
        if (this.caja.cajaEstado == 'ABIERTO') {
          this.estadocaja = true;
          this.montoapertura = '0.00';
          this.showInfoDialog();
        } else {
          this.messageService.clear();
          this.estadocaja = false;
          this.loadData(this.caja);
          this.showSucces();
        }
      }
      );
  }
  /* --------  CARGA EL MONTO DE APERTURA EN LA VISTA ----------- */
  loadData(caja: Caja) {
    this.montoapertura = this.validarEntero(caja.cajaMontocierre);
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
