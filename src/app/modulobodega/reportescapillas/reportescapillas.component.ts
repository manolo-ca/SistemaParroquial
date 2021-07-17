import { Component, OnInit } from '@angular/core';
import { Capilla } from '../capillas/capilla';
import { CapillaService } from '../capillas/capilla.service';
import { Producto } from '../productos/producto';
import { ProductoService } from '../productos/producto.service';
import {jsPDF} from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF)
//import 'jspdf-autotable';

@Component({
  selector: 'app-reportescapillas',
  templateUrl: './reportescapillas.component.html',
  styleUrls: ['./reportescapillas.component.css']
})
export class ReportescapillasComponent implements OnInit {

  cols: any[];

  capilla: Capilla = new Capilla();
  productos: Producto[];
  capillas: Capilla[];
  capillaselected:string;

  constructor(private capillaService:CapillaService, private productoservice:ProductoService) { }

  ngOnInit() {
    this.cols = [
      { field: 'size', header: 'Nombre' },
      { field: 'size', header: 'Cantidad' },
      { field: 'size', header: 'Precio' },
      { field: 'size', header: 'Detalle' }
    ];

    this.listarCapillas();
  }

  listarCapillas():void {
    this.capillaService.listarCapilla().subscribe((capillas) => {this.capillas = capillas});
  }

  listarProductosAlmacenCapilla(capiId):void{
    this.productoservice.getProductosAlmacenCapilla(capiId).subscribe((data)=>{
      this.productos = data;
      console.log(this.productos);
    })
  }

  exportPdf() {
    
    const prov = this.productos.map(inv => ({
      nom: inv.prodNombre, can: inv.prodCantidad, pre: inv.prodPrecio, det: inv.prodDetalle
    }));


    var columns = [
      {title: "Nombre", key: "nom"},
      {title: "Cantidad", key: "can"},
      {title: "Precio", key: "pre"},
      {title: "Detalle", key: "det"},
    
      
    ];

    let pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text( `Listado de Productos por Capilla:${(this.capilla.capiNombre)}`, 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);


    // (pdf as any).autoTable( columns, prov )
    let cont = 0;
    autoTable(pdf, {columns: columns, body: prov, didDrawCell: (HookData) => {
      if (HookData.row.index > 0 && HookData.row.index % 10 === 0 && HookData.row ) {
        cont ++;
        if (cont === 3 ) {
          pdf.addPage();
          cont = 0;
        }
        
      }
    }
  })
    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow')

    // Download PDF doc  
    pdf.save('ReporteCapilla.pdf');
  
  }
  OnChange(event){
    this.capilla.capiNombre=event.value.capiNombre;
    this.listarProductosAlmacenCapilla(event.value.capiId);
  }
 
}
