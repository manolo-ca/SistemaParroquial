import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import * as jspdf from 'jspdf';
import { CajaMovimiento } from '../caja/caja-movimiento';
import { CajaService } from '../caja/caja.service';
import { MessageService } from 'primeng/api';
import { ThrowStmt } from '@angular/compiler';
import { FacturaService } from 'src/app/moduloventas/administrar-factura/factura.service';
import { Factura } from 'src/app/moduloventas/administrar-factura/factura';
import { DetalleFactura } from 'src/app/moduloventas/administrar-factura/detalle-factura';
import { Cliente } from '../cliente/cliente';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { Compra } from 'src/app/modulocompras/administrar-compra/compra';
import { CompraService } from 'src/app/modulocompras/administrar-compra/compra.service';
import { DetalleCompra } from 'src/app/modulocompras/administrar-compra/detalle-compra';


@Component({
  selector: 'app-eucaristia',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [MessageService],
})
export class ReportesComponent implements OnInit {

  /* ----  VAriables tipo Fecha(date) ------------ */
  dateInicio: Date;
  dateFin: Date;


  drop: ingresoDrop[];
  dropselect: ingresoDrop;

/* ----  Variables tipo Logico (boolean) ------------ */
  displayMaximizable: boolean;
  compra: boolean;
  factura: boolean;
  gastos: boolean;

  /* ----  Arrays ------------ */
  reportlist = new Array<CajaMovimiento>();
  
  facturaDoc: Factura = new Factura;
  detalleFac: DetalleFactura;

/* ----  Variables tipo String (texto) ------------ */
  tipo_d: String;
  fechafac: String;
  numaut: String;
  ffinicio:String;
  fffinal: String;


  cajamovimiento: CajaMovimiento[];
  cajamovimientoaux: CajaMovimiento[];
  facturas: Factura[];
  cliente: Cliente = new Cliente();
  persona: Persona = new Persona();
  compraFac:Compra=new Compra();

/* ----  Variables tipo Numerico (Number) ------------ */
  totaliva: number = 0;
  totaldescuento: number = 0;
  totalivadescuento: number = 0;
  totalcerodescuento: number = 0;
  subtotalcero: number = 0;
  subtotaliva: number = 0;

  
  constructor(private compraService:CompraService,private facturaservice: FacturaService, private cajamovimientoservice: CajaService, private messageService: MessageService) {
    this.tipo_d = "Compras";
  }

  ngOnInit() {
    this.drop = [{ name: 'Compras' }, { name: 'Ventas' }, { name: 'Gastos' }];
    this.dropselect = this.drop[0];
    this.cargarDatos(this.dropselect.name);
    this.facturaservice.getFacturas().subscribe(data => this.facturas = data);
  }
  /* ----  metodo para visualizar documentos ------------ */
  visualizarDoc(iddoc: CajaMovimiento) {

    switch (this.tipo_d) {
      case "Compras": this.getCompraprev(iddoc);; break;
      case "Ventas": this.getventa(iddoc); break;
      case "Gastos": this.getGasto(); break;
    }
  }
/* ----  metodo para visualizar la compra ------------ */
  getCompraprev(iddoc: CajaMovimiento) {
    this.compraService.getCompra(iddoc.cajmIdDoc).subscribe(data => {
      this.persona = data.compFkProveedor.provFkPersona;
      this.compraFac = data;
      this.compra = true
      this.compraFac.detalleCompraCollection.map((detalle: DetalleCompra) => {

        //Cargamos los datos del detalle de la compra
        if (detalle.dectFkArticulos.prodIva == true) {
          this.totaliva += detalle.detcIva;
          this.subtotaliva += detalle.detcSubtotal
          this.totalivadescuento += detalle.detcSubtotal - detalle.detcDescuento;
        } else {
          this.totalcerodescuento += detalle.detcSubtotal - detalle.detcDescuento;
          this.subtotalcero += detalle.detcSubtotal;
        }
        this.totaldescuento += detalle.detcDescuento;
      });
      console.log(this.compraFac.compFechaemision);
    });
    
  }
/* ----  metodo para visualizar la venta ------------ */
  getventa(iddoc: CajaMovimiento) {
    console.log(iddoc.cajmIdDoc);
    this.facturaservice.getFactura(iddoc.cajmIdDoc).subscribe(data => {
      this.persona = data.factFkCliente.clieFkPersona;
      this.facturaDoc = data;
      this.factura = true;
      data.detalleFacturaCollection.map((detalle: DetalleFactura) => {
        console.log(detalle);
        if (detalle.detfFkProductos.prodIva == true) {
          this.totaliva += detalle.detfIva;
          this.subtotaliva += detalle.detfSubtotal
          this.totalivadescuento += detalle.detfSubtotal - detalle.detfDescuento;
          
        } else {
          this.totalcerodescuento += detalle.detfSubtotal - detalle.detfDescuento;
          this.subtotalcero += detalle.detfSubtotal;
          
        }
        this.totaldescuento += detalle.detfDescuento;
      });
     
    });
  }


/* ----  metodo para visualizar los gastos ------------ */
  getGasto() {
    this.gastos = true;
  }

  /* ----  Exportar PDF ------------ */

  exportPdf() {
    if (!this.validarfechas()) {
      this.reportlist = this.cajamovimientoaux;
      this.displayMaximizable = true;
    } else {
      this.ffinicio = this.getDate(this.dateInicio);
      this.fffinal = this.getDate(this.dateFin);
      console.log(this.fffinal+" "+this.ffinicio);
      this.displayMaximizable = true;
    }
  }
  /* ----  Visualizar el documento ------------ */


  OnChange(ev) {
    if (ev.value == null) {}else{
      this.cargarDatos(ev.value.name);
      this.tipo_d = ev.value.name;
    }
  }

  /* ----  Filtrar por Tipo  ------------ */
  cargarDatos(tipo: string) {
    switch (tipo) {
      case "Compras": this.load("COMPRA"); break;
      case "Ventas": this.load("VENTA"); break;
      case "Gastos": this.load("GASTO"); break;
    }
  }
  /* ----  filtrado de datos Fechas ------------ */
  filtradofecha() {
    if (this.validarfechas()) {
      this.reportlist = [];
      for (let index = 0; index < this.cajamovimientoaux.length; index++) {
        var fecha = new Date(this.cajamovimientoaux[index].cajmFecha);
        fecha.setDate(fecha.getDate() + 1);
        this.dateFin.setHours(23, 59, 59);
        if ((fecha.getTime() >= this.dateInicio.getTime()) && (fecha.getTime() <= this.dateFin.getTime())) {
          this.reportlist.push(this.cajamovimientoaux[index]);
        }
      }
      this.cajamovimiento = this.reportlist;
    } else {
      /* ----  mensaje de error de fechas  ------------ */
      this.messageService.clear();
      this.messageService.add({ severity: 'error', detail: 'Fechas no Validas por favor Ingresar de nuevo!' });
      setTimeout(() => {
        this.messageService.clear();
      }, 1500);
    }

  }

  /* ----  Cargar segun Tipo ------------ */
  load(tipo: string) {
    this.cajamovimientoservice.getMovimientos(tipo).subscribe(
      data => {
        this.cajamovimiento = data;
        this.cajamovimientoaux = data;
      }
    );
  }
  /* ----  metodo para obtener la fecha ------------ */
  getDate(date: Date): string {
    let numbermounth = date.getUTCMonth() + 1;
    let mounth = '';
    let day = '';
    if (date.getDate() < 10) day = '0' + date.getUTCDate(); else day = date.getDate().toString();
    if (numbermounth < 10) mounth = '0' + numbermounth; else mounth = numbermounth.toString();
    return date.getFullYear() + '-' + mounth + '-' + day;
  }
  /* ----  metodo para validar fechas inicio y fin ------------ */
  validarfechas() {
    if (this.dateInicio == null || this.dateInicio == undefined || this.dateFin == null || this.dateFin == undefined) {
      return false
    } else {
      if (this.dateFin.getTime() < this.dateInicio.getTime()) {
        return false
      } else {
        return true
      }
    }
  }
}

interface ingresoDrop {
  name: string;
}