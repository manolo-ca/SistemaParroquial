
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryOptions } from 'src/app/spring-generic-mvc/model';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import { CursilloMatrimonio } from './administrarcmatrimonio';
import { CursilloMatrimonioService } from './administrarcmatrimonio.service';

@Component({
  selector: 'app-administrarcmatrimonio',
  templateUrl: './administrarcmatrimonio.component.html'
})

export class AdministrarcmatrimonioComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE ADMINISTRAR CURSILLOS PRE-MATRIMONIALES-----------------------*/
  dis: boolean;
  dis2: boolean;
  submitted1 = false;
  cols: any[];
  tipo = {};
  addForm1: FormGroup;
  cursillosMatrimonio = new Array<CursilloMatrimonio>();
  cursillob : CursilloMatrimonio = new CursilloMatrimonio();
  cursillob2 : CursilloMatrimonio = new CursilloMatrimonio();
  bandera = false;
  loading = true;
  totalrecords;
  numerofilas = 10;
  pagina = 0;
  botonDis: boolean;
  submitted: boolean;
  alerta :Boolean=false;
  date :Date;
  date8 : Date;
  Estado : EstadoInterf[];
  estadoSelect: EstadoInterf;
  checked1: Boolean;
  Persona: Persona;
  PersonasLista : Persona[];
  fecInicio : Date = new Date;
  fecFin : Date = new Date;
  fechaReservacion : Date;
  ListaReporteCursillos= new Array<CursilloMatrimonio>();
  displayModal: boolean;
  displayBasic: boolean;
  displayBasic2: boolean;
  displayPosition: boolean;
  position: string;

  /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL CURSILLO-----------------------*/
  addForm: FormGroup =new FormGroup({
    nombreBautizo: new FormControl ('',[Validators.required]),
    nombreMadre: new FormControl ('',[Validators.required]),
    nombrePadre: new FormControl (''),
    lugarCursillo: new FormControl (''),
    horaCursillo: new FormControl (''),
    fechaCursillo: new FormControl ('')

  });

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(
    private nodeService: NodeService,
    private router: Router, 
    private formBuilder: FormBuilder, 
    private CursilloMatrimonioServicio : CursilloMatrimonioService, 
    private PersonaServicio : PersonaService
  ){

  }

  ngOnInit() {

    /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-MATRIMONIAL. EL METÓDO PARA LISTAR TODOS LOS CURSILLOS Y ALMACENAMOS-----------------------*/
    this.CursilloMatrimonioServicio.getCursillos().subscribe(data => {
      this.cursillosMatrimonio = data;
      this.totalrecords=this.cursillosMatrimonio.length;
    });

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL REGISTRO DEL CURSILLO-----------------------*/
    this.addForm1 = this.formBuilder.group({
      tipe_fecha_i: ['', Validators.required],
      tipe_fecha_f: ['', Validators.required],
      tipe_documento: ['', Validators.required]
    });

    /*-----------------------DECLARAMOS LOS ESTADOS QUE PUEDE TENER UN CURSILLO-----------------------*/
    this.Estado = [
      {name: 'Activo', estado:true},
      {name: 'Inactivo', estado:false}
    ];

    /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA LISTAR TODAS LAS PERSONAS Y ALMACENAMOS-----------------------*/
    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;
    });

  }

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA GESTIONAR LOS REPORTES DE LOS CURSILLOS PRE-MATRIMONIALES-----------------------*/
  showModalDialog() {
    this.displayModal = true;
  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  /*-----------------------METÓDOS PARA GESTIONAR LOS CURSILLOS DENTRO DE LA TABLA-----------------------*/
  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;  
  }
  onRowSelect(e) {}
  columnFilter(event: any) {}

  /*-----------------------METÓDO QUE DESHABILITA LA VENTANA DE VISUALIZAR UN CURSILLO-----------------------*/
  disable(){
    this.dis=false;
    this.botonDis=false;
    this.addForm.reset();
  }

  /*-----------------------METÓDO LAZY: PARA CARGAR DATOS A LA TABLA DE CURSILLOS-----------------------*/
  loadReservacionLazy(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.cursillosMatrimonio) {
        this.cursillosMatrimonio = this.cursillosMatrimonio.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 1000);
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-MATRIMONIAL. EL METÓDO PARA LISTAR TODOS LOS CURSILLOS Y ALMACENAMOS-----------------------*/
  listar(){
    this.CursilloMatrimonioServicio.getCursillos().subscribe(data => {
      this.cursillosMatrimonio = data;
      this.totalrecords=this.cursillosMatrimonio.length;
    });
  }

  /*-----------------------METÓDO PARA CARGAR DATOS A UN REPORTE FILTRADO POR FECHAS-----------------------*/
  cargarDatosReporte(){
    this.dis2 = true;
    this.ListaReporteCursillos =[];
    for (let index = 0; index < this.cursillosMatrimonio.length; index++){
      this.fechaReservacion =new Date (this.cursillosMatrimonio[index].cursmFecha);
      if((this.fechaReservacion.getTime() >= this.fecInicio.getTime()) && (this.fechaReservacion.getTime() <= this.fecFin.getTime())){
        this.ListaReporteCursillos.push(this.cursillosMatrimonio[index]);
      }
    }
  }

  /*-----------------------METÓDO PARA RE-DIRIGIR A LA VENTA DE INGRESO DE UN CURSILLO PRE-MATRIMONIAL-----------------------*/ 
  crearNuevo(){
    this.router.navigateByUrl("cursillomatrimonio");
  }

  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA-----------------------*/
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
      return persona.persCedula==cedula; 
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-MATRIMONIAL. EL METÓDO PARA ACTUALIZAR EL CURSILLO-----------------------*/
  ActualizarDatos(){
    if (this.addForm.invalid) {
      this.dis=false;
      console.log(this.cursillob2);
      Swal.fire(
        'Error al Actualizar',
         `Existen campos erróneos`,
        "error")
      return;
    }else{
      this.cursillob2.cursmEstado = this.checked1;
      this.cursillob2.cursmFecha = this.date;
      this.CursilloMatrimonioServicio.updateCursillo(this.cursillob2).subscribe(data =>{
        this.listar();
        this.dis=false;
        Swal.fire(
          'Actualizado Existosamente',
           `El cursillo se actualizo correctamente`,
        "success")
        this.addForm.reset();
        this.listar();
      });
    }
    this.disable();
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-MATRIMONIAL. EL METÓDO PARA ELIMINAR EL CURSILLO-----------------------*/
  EliminarTipo(cursillo: CursilloMatrimonio) {
    Swal.fire({
      title:'Eliminar Cursillo Pre-Bautizal',
      text: `¿Desea Eliminar el Cursillo de ${cursillo.cursmNnovio} y ${cursillo.cursmNnovia} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
      this.CursilloMatrimonioServicio.deleteCursillo(cursillo.cursmId).subscribe(response => {
        this.cursillosMatrimonio = this.cursillosMatrimonio.filter(servi => servi !== cursillo)
        this.listar();
        Swal.fire('Cursillo Eliminado!','','success')
      })
    }else if(result.isDenied){}
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-MATRIMONIAL. EL METÓDO PARA BUSCAR UN CURSILLO MEDIANTE EL ID-----------------------*/
  cargarCursillo(cursillo: CursilloMatrimonio): void {
    this.addForm.reset();
    localStorage.setItem("Id", cursillo.cursmId.toString());
    let tipeId = localStorage.getItem('Id');
    this.CursilloMatrimonioServicio.getCursillo(+tipeId)
    .subscribe(data =>{
      this.cursillob2 = data
      this.checked1 = this.cursillob2.cursmEstado;
      this.horaCursillo.setValue(this.cursillob2.cursmHora);
      this.nombreBautizo.setValue(this.cursillob2.cursmNnovia);
      this.nombreMadre.setValue(this.cursillob2.cursmNnovio);
      this.date = new Date(this.cursillob2.cursmFecha.toString());
      console.log(this.cursillob2.cursmLugar);
      this.dis = true;
    });
  }

  /*-----------------------MÉTODOS PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
  get nombreBautizo(){return this.addForm.get('nombreBautizo');}
  get nombreMadre(){return this.addForm.get('nombreMadre');}
  get nombrePadre(){return this.addForm.get('nombrePadre');}
  get lugarCursillo(){return this.addForm.get('lugarCursillo');}
  get horaCursillo(){return this.addForm.get('horaCursillo');}
  get fechaCursillo(){return this.addForm.get('fechaCursillo');}

  /*-----------------------MÉTODO PARA CAMBIAR DE ESTADO LA VARIABLE DE TIPO BOOLEAN-----------------------*/
  handleChange(e) {
    this.checked1 = e.checked;
  }

}

/*-----------------------INTERFAZ DE ESTADO DEL CURSILLO-----------------------*/
interface EstadoInterf {
  name: string;
  estado: boolean;
}
