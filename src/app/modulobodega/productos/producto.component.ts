import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/demo/service/carservice';
import { Car } from 'src/app/demo/domain/car';
import { ProductoService } from './producto.service';
import { Producto } from './producto';
import swal from 'sweetalert2';
import { ProveedorService } from '../proveedores/proveedor.service';
import { Proveedor } from '../proveedores/proveedor';
import { AlmacenService } from '../almacen/almacen.service';
import { Almacen } from '../almacen/almacen';

import {jsPDF} from 'jspdf';
import autoTable, { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF)
//import 'jspdf-autotable';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html'
})

export class  ProductoComponent implements OnInit {

  files: TreeNode[];
  addForm1: FormGroup;
  addForm2: FormGroup;
  dis: boolean;
  dis_edit: boolean;
  submitted = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  cars: Car[]

  producto: Producto = new Producto();
  productos: Producto[];

  almacen: Almacen = new Almacen();
  almacenes: Almacen[];
  

  proveedor: Proveedor = new Proveedor();
  proveedores: Proveedor[];

  showDialog() {
    this.producto.prodNombre = null;
    this.producto.prodId = null;
    this.producto.prodPrecio = null;
    this.producto.prodDetalle = null;
    this.producto.prodCantidad= null;
    this.producto.prodCategoria=null;
    this.producto.prodIva=false;
    this.dis = true;
  }

  showDialogEdit(producto2:Producto):void {
    this.dis_edit = true;
    this.producto = {
      prodIva:producto2.prodIva,
      prodCategoria:producto2.prodCategoria,
      prodCantidad: producto2.prodCantidad,
      prodDetalle: producto2.prodDetalle,
      prodId: producto2.prodId,
      prodNombre: producto2.prodNombre,
      prodPrecio: producto2.prodPrecio,
      prodFkAlmacen: producto2.prodFkAlmacen,
      prodFkProveedor: producto2.prodFkProveedor
    };
   
  }
  
  constructor(  private productoService:ProductoService,
    private nodeService: NodeService,private router: Router, private formBuilder: FormBuilder,private carService: CarService
    ,private proveedorService:ProveedorService, private almacenService:AlmacenService) { }

  ngOnInit() {
    this.carService.getCarsMedium().then(cars => this.cars = cars);

    this.cols = [
        { field: 'size', header: 'Proveedor' },
        { field: 'size', header: 'Almacen' },
        { field: 'size', header: 'Nombre' },
        { field: 'size', header: 'Cantidad' },
        { field: 'size', header: 'Precio' },
        { field: 'size', header: 'Detalle' }
    ];
    this.addForm1 = this.formBuilder.group({
    
      prodCategoria:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      prodNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      prodCantidad:  ['', Validators.required],
      prodPrecio:  ['', Validators.required],
      prodDetalle:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      prodIva:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
     
    });
   
    this.addForm2 = this.formBuilder.group({

      prodCategoria:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      prodNombre:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      prodCantidad:  ['', Validators.required],
      prodPrecio:  ['', Validators.required],
      prodDetalle:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
      prodIva:  ['', [Validators.required,Validators.pattern(/[a-zA-Z ]*/)]],
     
    });
    this.listarProductos();
    this.listarProveedor();
    this.listarAlmacenes();
  
  }
  
  get f(){
    return this.addForm1.controls;
  }
  get f1(){
    return this.addForm2.controls;
  }

  getproveedorName(proveeodr: Proveedor): string{
    console.log(proveeodr.provFkPersona.persNombre);
    let nombre:string =  proveeodr.provFkPersona.persNombre + ' ' + proveeodr.provFkPersona.persApellido;
    return nombre;
  }

  listarAlmacenes():void {
    this.almacenService.listarAlmacen().subscribe((almacenes) => {this.almacenes = almacenes;
      this.producto.prodFkAlmacen = almacenes[0];
    });
  }
  
  listarProveedor():void{
    this.proveedorService.listarProveedor().subscribe((proveedores) => {this.proveedores = proveedores;
      this.producto.prodFkProveedor= proveedores[0];});
  }

  listarProductos():void {
    this.productoService.listarProducto().subscribe((productos) => {this.productos = productos});
  }

  crearProducto():void {
    if (this.producto.prodIva === null) {
      this.producto.prodIva = false;
    }
    if (this.addForm1.invalid) {
      this.submitted = true;
      return;
    }
    this.productoService.crearProducto(this.producto).subscribe(producto => {
      swal.fire('Productos','Producto creado con exito.','success')
      this.listarProductos();
    })
    this.dis = false;
  }

  editarProducto():void {
    if (this.addForm2.invalid) {
      this.submitted = true;
      return;
    }
    this.productoService.editarProducto(this.producto).subscribe(producto=> {
      swal.fire('Productos','Producto editado con exito.','success')
      this.listarProductos();
    })
    this.dis_edit = false;
  }

  eliminarProducto(producto: Producto): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.producto.prodNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto.prodId).subscribe(
          response => {
            this.productos = this.productos.filter(servi => servi !== producto)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El Producto fue eliminado.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El Producto no se elimino :)',
          'error'
        )
      }
    })
  }
  cargarDatosProveedor(event):void{
    this.proveedor = event.value;
    this.producto.prodFkProveedor = this.proveedor;
  }

  exportPdf() {
    
    const prov = this.productos.map(inv => ({
      nom: inv.prodNombre, can: inv.prodCantidad, pre: inv.prodPrecio, det: inv.prodDetalle, pro: inv.prodFkProveedor.provFkPersona.persNombre +' '+inv.prodFkProveedor.provFkPersona.persApellido ,
      alm: inv.prodFkAlmacen.almaNombre, cat: inv.prodCategoria, iva: this.aplicaIva(inv.prodIva)
    }));

    var columns = [
      {title: "Nombre", key: "nom"},
      {title: "Cantidad", key: "can"},
      {title: "Precio", key: "pre"},
      {title: "Detalle", key: "det"},
      {title: "Proveedor", key: "pro"},
      {title: "Almacen", key: "alm"},
      {title: "Categoria", key: "cat"},
      {title: "Aplica Iva", key: "iva"},
      
    ];

    let pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('Listado de Productos', 11, 8);
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
    pdf.save('Producto.pdf');  
  }

  cargarDatosAlmacen(event):void{
    this.almacen = event.value;
    this.producto.prodFkAlmacen = this.almacen;
  }

  aplicaIva(iva: Boolean): string 
    {if (iva) {
      return 'Aplica';
    }else{
      return 'N/A';

    }
  }
}