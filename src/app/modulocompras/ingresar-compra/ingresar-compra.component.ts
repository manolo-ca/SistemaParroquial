import { Component, OnInit } from '@angular/core';
import { Almacen } from 'src/app/modulobodega/almacen/almacen';
import { AlmacenService } from 'src/app/modulobodega/almacen/almacen.service';
import { InventarioService } from 'src/app/modulobodega/inventarios/inventario.service';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from '../../modulosp/registropersona/persona.service'
import swal from 'sweetalert2';
import { Caja } from '../../modulofactura/caja/caja';
import { Compra } from '../administrar-compra/compra';
import { CajaMovimiento } from '../../modulofactura/caja/caja-movimiento';
import { CajaService } from '../../modulofactura/caja/caja.service';
import { CompraService } from '../administrar-compra/compra.service';
import { DetalleCompra } from '../administrar-compra/detalle-compra';
import { Inventario, Inventario2 } from '../administrar-compra/inventario';
import { Producto, Producto2 } from '../administrar-compra/producto';
import { Proveedor, Proveedor2 } from '../administrar-compra/proveedor';
import { ProductoService } from 'src/app/modulobodega/productos/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from 'src/app/modulobodega/proveedores/proveedor.service';



@Component({
  selector: 'app-ingresar-compra',
  templateUrl: './ingresar-compra.component.html',
})
export class IngresarCompraComponent implements OnInit {

  titulo: string = "Compra";
  validaboton: boolean = false;
  proveedorpersona: boolean = false;
  addForm1: FormGroup;
  addForm3: FormGroup;
  dis: boolean;
  submitted = false;
  cols: any[];
  disa3: boolean;
  disa: boolean;
  disa2: boolean;
  editproveedor: boolean;
  lista_personas: boolean;
  productosVentana: boolean;
  inventarioVentana: boolean;

  productos: Producto[];
  productos2: Producto2[];
  productos3: Producto2[];
  proveedores: Proveedor[];
  proveedores2: Proveedor2[];
  inventarios: Inventario[];
  inventarioTemp: Inventario2[];
  almacenes: Almacen[];
  personas: Persona[];
  cajas: Caja[];


  proveedor: Proveedor = new Proveedor();
  proveedor2: Proveedor = new Proveedor();
  persona: Persona = new Persona();
  compra: Compra = new Compra();
  inventario: Inventario = new Inventario();
  almacen: Almacen = new Almacen();
  almacen2: Almacen = new Almacen();
  producto: Producto = new Producto();
  producto2: Producto2 = new Producto2();
  producto3: Producto2 = new Producto2();
  caja: Caja = new Caja();
  cajamovimiento: CajaMovimiento = new CajaMovimiento();
  provedornuevo: Proveedor2 = new Proveedor2();
  constructor(
    private compraService: CompraService,
    private cajaService: CajaService,
    private almacenservice: AlmacenService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    private inventarioService: InventarioService,
    private personaService: PersonaService,
    private proveedorService: ProveedorService
  ) { }

  es: any;
  ngOnInit() {
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"],
      dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Agt", "Sep", "Oct", "Nov", "Dec"],
      today: 'Hoy',
      clear: 'Borrar',
    };
    this.listarCajas();

    this.listarProveedor();

    this.listarAlmacen();
    console.log(this.almacenes);
    this.addForm1 = this.formBuilder.group({
      prodFkProveedor: ['', [Validators.required]],
      prodFkAlmacen: ['', [Validators.required]],
      prodCategoria: ['', [Validators.required]],
      prodNombre: ['', [Validators.required]],
      prodCantidad: ['', Validators.required],
      prodPrecio: ['', Validators.required],
      prodDetalle: ['', [Validators.required]],
      prodIva: ['', [Validators.required]]
      // prodFkActivo: ['', [Validators.required]]
    });
    this.addForm3 = this.formBuilder.group({
      inse_id: ['', Validators.required],
      inse_cedula: ['', Validators.required],
      inse_nombre: ['', Validators.required],
      inse_apellido: ['', Validators.required],
      inse_email: ['', Validators.required],
      inse_telefono: ['', Validators.required],
      inse_direccion: ['', Validators.required],
      inse_fechanaci: ['', Validators.required],
      inse_fechabautizo: ['', Validators.required]
    });
  }
  get f() {
    return this.addForm1.controls;
  }
  /* --------  GESTIONAR PRODUCTO DENTRO DE COMPRA----------- */
  gestionarProducto() {
    this.cancelar();
    this.listarProductos();
    this.submitted = false;
    this.disa = true;
  }



  /* --------  GESTIONAR INVENTARIO DENTRO DE COMPRA----------- */
  gestionarInventario() {
    this.disa2 = true;
  }

  /* --------  GESTIONAR PROVEEDOR DENTRO DE COMPRA----------- */
  gestionarProveedor() {
    this.disa3 = true;
    this.listarProveedor();

  }
  cerrarProveedor() {
    this.disa3 = false;
    this.cancelarPersona()
  }

  showDialog() {
    this.disa3 = false;
    this.lista_personas = true;
    this.listarPersonas();
  }
  crearPersonasTemp() {
    this.cancelarPersona();
    this.editproveedor = true;
    this.lista_personas = false;
  }
  cancelarEdision() {
    this.editproveedor = false;
    this.disa3 = true;
  }

  cerrarPersonas() {
    this.lista_personas = false;
    this.disa3 = true
  }
  /* --- BUSCADOR DE PRODUCTOS --- */
  autocompleteProducto(event) {
    this.compraService.buscarProductoCompra(event.query).subscribe(data => { this.productos = data })
    console.log(this.productos)
  }
  /* --- BUSCADOR DE Inventario --- */
  autocompleteInventario(event) {
    this.compraService.buscarInventarioCompra(event.query).subscribe(data => { this.inventarios = data })
  }
  /* --- BUSCADOR DE PROVEEDOR --- */
  autocompleteProveedor(event) {
    this.compraService.buscarProveedorCompra(event.query).subscribe(data => { this.proveedores = data })
  }
  /* --- listar proveedor--- */
  listarProveedor(): void {
    this.proveedorService.listarProveedor().subscribe((proveedores) => { this.proveedores2 = proveedores });
  }
  /* --- listar producto --- */
  listarProductos(): void {
    this.productoService.listarProducto().subscribe((productos2) => { this.productos2 = productos2 });
  }
  /* --- CARGA PRODUCTOS AL DETALLE DE LA COMPRA --- */
  cargarProductos(event): void {
    let producto = event as Producto;

    if (this.validarLineaDetalle(producto.prodId)) {
      this.incrementarCantidad(producto.prodId);
    } else {
      let nuevoDetalle = new DetalleCompra();
      nuevoDetalle.producto = producto;
      nuevoDetalle.dectFkArticulos = producto;
      nuevoDetalle.productoId = producto.prodId;
      this.compra.detalleCompraCollection.push(nuevoDetalle);

    }

    this.validaboton = true;
  }

  /* --- CARGA INVENTARIO AL DETALLE DE LA COMPRA --- */


  cargarInventario(event): void {
    let inventario = event as Inventario;

    if (this.validarLineaDetalleInventario(inventario.inveId)) {
      this.incrementarCantidadInventario(inventario.inveId);
    } else {
      let nuevoDetalle = new DetalleCompra();
      nuevoDetalle.inventario = inventario;
      nuevoDetalle.detcFkInventarios = inventario.inveId;
      this.compra.detalleCompraCollection.push(nuevoDetalle);
    }
    this.validaboton = true;
  }



  /* --- CARGA LOS DATOS DEL PROVEEDOR EN EL FORMULARIO --- */
  cargarProveedor(event): void {
    this.proveedor = event;
    this.persona = this.proveedor.provFkPersona;
    console.log(this.persona);
    this.compra.compFkProveedor = this.proveedor;
  }


  /* --- ACTUALIZA LAS CANTIDADES EL TOTAL,IVA Y SUBTOTAL DE LOS DETALLES --- */
  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) { // SI LA CANTIDAD ES CERO ELIMINA EL PRODUCTO DEL DETALLE 
      return this.eliminarDetalle(id);
    }
    this.compra.detalleCompraCollection = this.compra.detalleCompraCollection.map((detalle: DetalleCompra) => {
      if (id === detalle.producto.prodId) {
        detalle.detcCantidad = cantidad;
        //detalle.detfCantidad+detalle.dettExistencias; //acutalizamos el campo cantidad dentro del array
        detalle.detcSubtotal = detalle.calcularTotalProducto();
        if (detalle.producto.prodIva == true) {
          detalle.detcIva = detalle.detcSubtotal * 0.12;
        } else {
          detalle.detcIva = 0;
        }

        console.log(detalle.detcSubtotal, detalle.detcCantidad, detalle.detcIva);
      }
      return detalle;
    });
  }
  /* --- ACTUALIZA LAS CANTIDADES EL TOTAL,IVA Y SUBTOTAL DE LOS DETALLES INVENTARIO--- */
  actualizarCantidadInventario(id: number, event: any): void {
    let cantidad: number = event.target.value as number;


    if (cantidad == 0) { // SI LA CANTIDAD ES CERO ELIMINA EL PRODUCTO DEL DETALLE 
      return this.eliminarDetalleInventario(id);
    }
    this.compra.detalleCompraCollection = this.compra.detalleCompraCollection.map((detalle: DetalleCompra) => {
      if (id === detalle.inventario.inveId) {
        detalle.detcCantidad = cantidad;
        //detalle.detfCantidad+detalle.dettExistencias; //acutalizamos el campo cantidad dentro del array
        detalle.detcSubtotal = detalle.calcularTotalInventario();
        detalle.detcIva = detalle.detcSubtotal * 0.12;
        console.log(detalle.detcSubtotal, detalle.detcCantidad, detalle.detcIva);
      }
      return detalle;
    });
  }


  /* --- VALIDACIONES DE DETALLE DE COMPRA  --- */
  validarLineaDetalle(id: number): boolean {
    let existeprod = false;
    this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      if (id === detalle.producto.prodId) {
        existeprod = true;
      }
    });
    return existeprod;
  }

  /* --- VALIDACIONES DE DETALLE DE COMPRA INVENTARIO  --- */
  validarLineaDetalleInventario(id: number): boolean {
    let existeinv = false;
    this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      if (id === detalle.inventario.inveId) {
        existeinv = true;
      }
    });
    return existeinv;
  }

  /* --- INCREMENTAR LA CANTIDAD DE LOS PRODUCTOS REPETIDOS EN EL DETALLE --- */
  incrementarCantidad(id: number): void {
    this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      if (id === detalle.producto.prodId) {
        ++detalle.detcCantidad;
      }
    });
  }
  incrementarCantidadInventario(id: number): void {
    this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      if (id === detalle.inventario.inveId) {
        ++detalle.detcCantidad;
      }
    });
  }

  /* --- ELIMINA EL PRODUCTO DEL DETALLE --- */
  eliminarDetalle(id: number): void {
    this.compra.detalleCompraCollection = this.compra.detalleCompraCollection.filter((detalle: DetalleCompra) => id !== detalle.producto.prodId);
  }/* --- ELIMINA INVENTEARIO DEL DETALLE --- */
  eliminarDetalleInventario(id: number): void {
    this.compra.detalleCompraCollection = this.compra.detalleCompraCollection.filter((detalle: DetalleCompra) => id !== detalle.inventario.inveId);
  }

  /* --- REGISTRA LA COMPRA EN LA BASE DE DATOS --- */
  crearCompra(compraForm): void {
    if (
      compraForm.form.valid &&
      this.compra.compFechaemision != null &&
      this.compra.detalleCompraCollection.length > 0 &&
      this.cajamovimiento.cajmObservaciones != null &&
      this.cajamovimiento.cajmObservaciones.length > 0 &&
      this.caja.cajaNombre != null &&
      this.compra.compFkProveedor != null) {
      swal.fire({
        title: this.titulo,
        text: '¿Desea guardar la siguiente compra?',
        showCancelButton: true,
        confirmButtonText: `Confirmar`,
        denyButtonText: `Cancelar`,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.compra.compEstado = "ACTIVO";
          console.log(this.persona)
          console.log(this.compra)
          this.compraService.crearCompra(this.compra).subscribe(compraTemporal=> {
            if (this.almacen.almaVenta == true) {
              this.sumarStock();

            } else {
              this.sumarStockInventario();
            }

            this.generarCajaMovimiento(compraTemporal);
            swal.fire(this.titulo, `Compra Nro ${compraTemporal.compNumdocumento} creada con exito`, 'success')
            this.validaboton = false;//se edito
            compraForm.form.reset();
            this.compra = new Compra();
          });
        } else if (result.isDenied) {
          this.validaboton = false;//se edito
          result.dismiss === swal.DismissReason.cancel
        }
      })
    } else {
      swal.fire(this.titulo, 'Debe llenar todos los campos requeridos', 'error')
    }
  }
  /* --- ACTUALIZA EL STOCK DEL PRODUCTO EN INVENTARIO ---- */
  sumarStock(): void {
    this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      this.compraService.sumarStock(detalle.productoId, detalle.detcCantidad).subscribe(producto => {
        console.log(producto);
      });
    });
  }
  sumarStockInventario(): void {
    this.compra.detalleCompraCollection.forEach((detalle: DetalleCompra) => {
      this.compraService.sumarStockInventario(detalle.detcFkInventarios, detalle.detcCantidad).subscribe(inventario => {
        console.log(inventario);
      });
    });
  }

  /* ---- LISTA ALMACEN ---- */
  listarAlmacen() {
    this.almacenservice.listarAlmacen().subscribe(data => { this.almacenes = data });
  }

  cargarAlmacen(event): void {
    this.almacen = event.value;
    console.log(this.almacen.almaId);
    if (this.almacen.almaVenta == true) {
      this.productoService.getProductosAlmacen(this.almacen.almaId).subscribe(data => { this.productos3 = data })
    } else {
      this.inventarioService.getInventarioAlmacen(this.almacen.almaId).subscribe(data => { this.inventarioTemp = data })
    }


  }
  crearProducto(): void {

    if (this.producto2.prodIva === null) {
      this.producto2.prodIva = false;
      console.log("entra1")
    }
    if (this.addForm1.invalid) {
      this.submitted = true;
      console.log(this.producto2);
      //swal.fire('campos vacios','llene todos los campos','error');
      return;
    } else {
      this.disa = false;
      console.log(this.producto2);

      this.productoService.crearProducto(this.producto2).subscribe(producto2 => {
        swal.fire('Productos', 'Producto creado con exito.', 'success')
        this.cancelar();
      })
    }

  }
  eliminar(producto2: Producto2): void {
    this.disa = false;
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${this.producto2.prodNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto2.prodId).subscribe(
          response => {
            this.productos2 = this.productos2.filter(servi => servi !== producto2)
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
          'El Producto no se elimino',
          'error'
        )
        this.dis = true;
      }
    })
  }
  preparedit(productoedit: Producto2): void {
    var id = productoedit.prodId
    console.log(id)
    this.productoService.getProducto(id).subscribe((data) =>
      this.producto2 = data)
    //this.producto2 = productoedit;
    /*{
    prodIva:productoedit.prodIva,
    prodCategoria:productoedit.prodCategoria,
    prodCantidad: productoedit.prodCantidad,
    prodDetalle: productoedit.prodDetalle,
    prodId: productoedit.prodId,
    prodNombre: productoedit.prodNombre,
    prodPrecio: productoedit.prodPrecio,
    prodFkAlmacen: productoedit.prodFkAlmacen,
    prodFkProveedor: productoedit.prodFkProveedor
  };*/

  }

  editarProducto(): void {
    this.disa = false;
    console.log(this.producto2);
    this.productoService.editarProducto(this.producto2).subscribe(producto2 => {
      swal.fire('Productos', 'Producto editado con exito.', 'success')
      this.listarProductos();
      this.cancelar();
    })
    this.dis = false;
  }
  cancelar() {
    this.producto2.prodId = null;
    this.producto2.prodIva = null;
    this.producto2.prodNombre = null;
    this.producto2.prodPrecio = null;
    this.producto2.prodFkProveedor = null;
    this.producto2.prodFkAlmacen = null;
    this.producto2.prodDetalle = null;
    this.producto2.prodCategoria = null;
    this.producto2.prodCantidad = null;
  }
  /*   Lista a las personas que se encuentran registradas  en la tabla personas para luego agregarlas a la tabla proveedores*/
  listarPersonas(): void {
    this.personaService.listarPersonasProveedor().subscribe((personas) => {
      this.personas = personas;
    });
  }

  guardarProveedor(personaGuardar: Persona): void {
    this.lista_personas = false;
    console.log(personaGuardar)
    this.provedornuevo.provFkPersona = personaGuardar;
    this.proveedorService.crearProveedor(this.provedornuevo).subscribe(proveedor => {

      swal.fire('Proveedores', 'Proveedor creado con exito.', 'success')
      this.listarProveedor();
    })
    this.dis = false;
  }

  eliminarProveedor(proveedorborrar: Proveedor2): void {
    this.disa3 = false;
    console.log(proveedorborrar)
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${proveedorborrar.provFkPersona.persNombre + ' ' + proveedorborrar.provFkPersona.persApellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminarProveedor(proveedorborrar.provId).subscribe(
          response => {
            this.proveedores2 = this.proveedores2.filter(servi => servi !== proveedorborrar)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El proveedor fue eliminado.`,
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
          'El proveedor no se elimino :)',
          'error'
        )
      }
    })
  }

  seleccionarProveedor(proveedorTemp: Proveedor): void {
    this.proveedorpersona = true;
    console.log(proveedorTemp)
    this.compra.compFkProveedor = proveedorTemp;
    this.persona = proveedorTemp.provFkPersona
    console.log("pasa")
    console.log(this.persona)
    this.disa3 = false;
  }
  editarProveedor(proveedorEdit: Proveedor): void {
    this.disa3 = false;
    console.log(proveedorEdit);
    this.editproveedor = true;
    var persid = proveedorEdit.provFkPersona.persid;
    this.personaService.getPersona(+persid).subscribe((data) =>
      this.persona = data);
    console.log(this.persona);


  }
  public validadorNumericos;

  public validarNumericos(telefono: String, cedula: String) {
    let numericos = false;
    var valoresAceptados = /^[0-9]+$/;
    if (telefono.match(valoresAceptados) && cedula.match(valoresAceptados)) {
      numericos = true;
    } else {
      this.editproveedor = false;
      swal.fire(
        'Error de Campos',
        'Revise que los datos de cedula o telefono sean numericos',
        'error'
      )
      numericos = false;
    }
    return this.validadorNumericos = numericos;
  }
  public validador;

  validadorDeCedula(cedula: String) {
    let cedulaCorrecta = false;
    if (cedula.length == 10) {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      if (tercerDigito < 6) {
        // El ultimo digito se lo considera dígito verificador
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(cedula.substring(9, 10));
        let suma: number = 0;
        let digito: number = 0;
        for (let i = 0; i < (cedula.length - 1); i++) {
          digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
        }
        suma = Math.round(suma);
        if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
          cedulaCorrecta = true;
        } else if ((10 - (Math.round(suma % 10))) == verificador) {
          cedulaCorrecta = true;
        } else {
          cedulaCorrecta = false;
        }
      } else {
        cedulaCorrecta = false;
      }
    } else {
      cedulaCorrecta = false;
    }
    this.validador = cedulaCorrecta;
  }

  public updateproveedor(): void {
    var cedula2 = this.persona.persCedula;
    var telefono = this.persona.persTelefono;

    var email = this.persona.persEmail;
    if (
      this.persona.persCedula != null &&
      this.persona.persNombre != null &&
      this.persona.persApellido != null &&
      this.persona.persTelefono != null &&
      this.persona.persDireccion != null) {
      this.validarNumericos(telefono, cedula2)

      if (this.validadorNumericos == true) {
        this.validadorDeCedula(cedula2);

        if (this.validador == true) {
          this.editproveedor = false;
          this.personaService.update(this.persona)
            .subscribe(cliente => {
              swal.fire(
                'Usuario Actualizado',
                `Usuario ${this.persona.persNombre} Actualizado con exito!`,
                'success'
              )
              this.listarProveedor();
              this.cancelarPersona();

            }
            )
        } else {
          this.editproveedor = false;
          swal.fire(

            'Error de cedula',

            'Revise la cedula ingresada',
            'error'
          )
        }
      }
    } else {
      this.editproveedor = false;
      swal.fire(
        'Error de entrada',
        'Revise los datos ingresados del Proveedor',
        'error'
      )
    }
  }
  public validadorCorreo;
  //******* SE REALIZA LA VALIDACION DE CORREO ELECTRONICO */
  public validarCorreo(correo: String) {
    let email = false;
    if (correo == null) {
      email = true
    } else {
      if (correo.length > 0) {
        var re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if (!re.exec(correo.toString())) {
          swal.fire(
            'Error de Correo',
            'Revise que el correo ingresado sea correcto',
            'error'
          )
          this.editproveedor = false;
          email = false
        } else {
          email = true
        }
      } else {
        email = true
      }
    }
    return this.validadorCorreo = email;
  }
  //******** CREA UN USUARIO Y CALIDA SU ID ES DECIR SU NUMERO DE CEDULA  */
  public createPersona(): void {
    var cedula2 = this.persona.persCedula;
    var telefono = this.persona.persTelefono;
    var email = this.persona.persEmail;
    console.log(email)
    if (
      this.persona.persCedula != null &&
      this.persona.persNombre != null &&
      this.persona.persApellido != null &&
      this.persona.persTelefono != null &&
      this.persona.persDireccion != null) {
      this.validarNumericos(telefono, cedula2);

      this.validarCorreo(email);
      if (this.validadorNumericos == true && this.validadorCorreo == true) {
        this.validadorDeCedula(cedula2);
        if (this.validador == true) {
          this.editproveedor = false;
          this.personaService.create(this.persona).subscribe(
            Response => {
              swal.fire(
                'Usuario Guardado',
                `Usuario ${this.persona.persNombre} creado con exito!`,
                'success'
              )
              this.listarPersonas();
              this.cancelarPersona();
              this.editproveedor = false;
            }
          )
        } else {
          swal.fire(
            'Error de cedula',
            'Revise la cedula ingresada',
            'error'
          )
        }
      }
    } else {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
    }
  }
  public cancelarPersona(): void {
    this.persona.persid = null;
    this.persona.persCedula = null;
    this.persona.persNombre = null;
    this.persona.persApellido = null;
    this.persona.persEmail = null;
    this.persona.persTelefono = null;
    this.persona.persDireccion = null;
    this.persona.persfechanacimiento = null;
    this.persona.persfechabautismo = null;
  }
  cargarProductoVentana() {
    this.productosVentana = true;
    //this.productos2=this.productos;
    console.log(this.productos)
  }
  cargarInventarioVentana() {
    this.inventarioVentana = true;
    console.log(this.inventarios)
  }
  agregarListaProducto(productoTemp: Producto): void {

    let nuevoDetalle = new DetalleCompra();
    if (this.validarLineaDetalle(productoTemp.prodId)) {
      this.incrementarCantidad(productoTemp.prodId);
    } else {
      nuevoDetalle.producto = productoTemp;
      nuevoDetalle.dectFkArticulos = productoTemp;
      nuevoDetalle.productoId = productoTemp.prodId;
      this.compra.detalleCompraCollection.push(nuevoDetalle);
    }
    this.validaboton = true;
  }
  agregarListaInventario(inventarioTemp: Inventario): void {


    if (this.validarLineaDetalleInventario(inventarioTemp.inveId)) {
      this.incrementarCantidadInventario(inventarioTemp.inveId);
    } else {
      let nuevoDetalle = new DetalleCompra();
      nuevoDetalle.inventario = inventarioTemp;
      nuevoDetalle.detcFkInventarios = inventarioTemp.inveId;
      this.compra.detalleCompraCollection.push(nuevoDetalle);
    }
    this.validaboton = true;
  }
  /* ---- LISTA TODAS LAS CAJAS DEL SISTEMA ---- */
  listarCajas(): void {

    this.cajaService.cargarCaja("ABIERTO").subscribe(data => { this.cajas = data });
/*
    if (this.cajas.length == 0) {
      swal.fire({
        title: 'Facturacion',
        text: 'Debe aperturar caja para realizar una venta',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          // this.router.navigate(['facturacion/caja-apertura']);
        }
      })
    }*/
  }
  /* --- CARGA LOS DATOS DE LA CAJA SELECCIONADA --- */
  cargarDatosCaja(event): void {
    this.caja = event.value;
    console.log(this.caja);
  }
  generarCajaMovimiento(compraTemporal:Compra): void {

    var idDoc = this.compra.compNumautorizacion;
    this.cajamovimiento.cajmEstado = 'ACTIVO';
    this.cajamovimiento.cajmMonto = this.compra.compTotal;
    this.cajamovimiento.cajmNumDoc = this.compra.compNumdocumento;
    this.cajamovimiento.cajmIdDoc = compraTemporal.compId;
    this.cajamovimiento.cajmFecha = this.compra.compFechaemision;
    this.cajamovimiento.cajmTipo = 'COMPRA';
    this.cajamovimiento.cajmFkCaja = this.caja;
    this.cajamovimiento.cajmHoraemisionDoc = this.formatTime();
    console.log(this.cajamovimiento);
    this.cajaService.crearMovimientoCaja(this.cajamovimiento).subscribe(cajamovimiento => {

    })

  }
  /* ----------------------- FUNCION PARA GENERAR LA HORA DE EMISION DEL DOCUMENTO ---------------------------- */
  formatTime(): string {
    let date = new Date();
    let hours = "00";
    let minutes = "00";
    if (date.getHours() < 10) { hours = "0" + date.getHours() } else { hours = date.getHours().toString() };
    if (date.getMinutes() < 10) { minutes = "0" + date.getMinutes() } else { minutes = date.getMinutes().toString() };
    return hours + ":" + minutes;
  }

  pruebadatos(compraForm) {
    if (
      compraForm.form.valid &&
      this.compra.compFechaemision != null &&
      this.compra.detalleCompraCollection.length > 0 &&
      this.cajamovimiento.cajmObservaciones != null &&
      this.cajamovimiento.cajmObservaciones.length > 0 &&
      this.caja.cajaNombre != null &&
      this.compra.compFkProveedor != null
    ) {
      console.log("vale")
      console.log(this.compra)
      console.log(this.caja)
    } else {
      console.log("no vale")
      console.log(this.compra)
      console.log(this.caja)
    }
  }
}
