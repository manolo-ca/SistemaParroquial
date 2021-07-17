
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CursilloBautizo } from './administrarcbautizo';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { CursilloBautizoService } from './administrarcbautizo.service';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';

@Component({
  selector: 'app-administrarcbautizo',
  templateUrl: './administrarcbautizo.component.html'
})

export class AdministrarcbautizoComponent implements OnInit {
 
  /*-----------------------VARIABLES DEL COMPONENTE DE ADMINISTRAR CURSILLOS DE BAUTIZO-----------------------*/
  dis: boolean;
  dis2: boolean;
  submitted1 = false;
  cols: any[];
  tipo = {};
  addForm1: FormGroup;
  cursillosbautizo = new Array<CursilloBautizo>();
  cursillob : CursilloBautizo = new CursilloBautizo();
  cursillob2 : CursilloBautizo = new CursilloBautizo();
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
  ListaReporteCursillos= new Array<CursilloBautizo>();
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
    private CursilloBautizoServicio : CursilloBautizoService, 
    private PersonaServicio : PersonaService
  ){ 

  }


  ngOnInit() {

    /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO BAUTIZO. EL METÓDO PARA LISTAR TODOS LOS CURSILLOS Y ALMACENAMOS-----------------------*/
    this.CursilloBautizoServicio.getCursillos().subscribe(data => {
      this.cursillosbautizo = data;
      this.totalrecords=this.cursillosbautizo.length;
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

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA GESTIONAR LOS REPORTES DE LOS CURSILLOS PRE-BAUTISMALES-----------------------*/
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
  columnFilter(event: any) {}
  onRowSelect(e) {}

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
      if (this.cursillosbautizo) {
        this.cursillosbautizo = this.cursillosbautizo.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 1000);
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-BAUTISMAL. EL METÓDO PARA LISTAR TODOS LOS CURSILLOS Y ALMACENAMOS-----------------------*/
  listar(){
    this.CursilloBautizoServicio.getCursillos().subscribe(data => {
      this.cursillosbautizo = data;
      this.totalrecords=this.cursillosbautizo.length;
    });
  }

  /*-----------------------METÓDO PARA CARGAR DATOS A UN REPORTE FILTRADO POR FECHAS-----------------------*/
  cargarDatosReporte(){
    this.dis2 = true;
    this.ListaReporteCursillos =[];
    for (let index = 0; index < this.cursillosbautizo.length; index++){
      this.fechaReservacion =new Date (this.cursillosbautizo[index].cursbFecha);
      if((this.fechaReservacion.getTime() >= this.fecInicio.getTime()) && (this.fechaReservacion.getTime() <= this.fecFin.getTime())){
        this.ListaReporteCursillos.push(this.cursillosbautizo[index]);
      }
    }
  }

  /*-----------------------METÓDO PARA RE-DIRIGIR A LA VENTA DE INGRESO DE UN CURSILLO PRE-BAUTISMAL-----------------------*/
  crearNuevo(){
    this.router.navigateByUrl("cursillobautizo");
  }

  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA-----------------------*/
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
  }
  
  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-BAUTISMAL. EL METÓDO PARA ACTUALIZAR EL CURSILLO-----------------------*/
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
      this.cursillob2.cursbEstado = this.checked1;
      this.cursillob2.cursbFecha = this.date;
      this.CursilloBautizoServicio.updateCursillo(this.cursillob2).subscribe(data =>{
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

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-BAUTISMAL. EL METÓDO PARA ELIMINAR EL CURSILLO-----------------------*/
  EliminarTipo(cursillo: CursilloBautizo) {
    Swal.fire({
      title:'Eliminar Cursillo Pre-Bautizal',
      text: `¿Desea Eliminar el Cursillo de ${cursillo.cursbNombreb} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
      this.CursilloBautizoServicio.deleteCursillo(cursillo.cursbId).subscribe(response => {
        this.cursillosbautizo = this.cursillosbautizo.filter(servi => servi !== cursillo)
        this.listar();
        Swal.fire('Cursillo Eliminado!','','success')
      })
    }else if(result.isDenied){}
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-BAUTISMAL. EL METÓDO PARA BUSCAR UN CURSILLO MEDIANTE EL ID-----------------------*/
  cargarCursillo(cursillo: CursilloBautizo): void {
    this.addForm.reset();
    localStorage.setItem("reseId", cursillo.cursbId.toString());
    let tipeId = localStorage.getItem('reseId');
    this.CursilloBautizoServicio.getCursillo(+tipeId)
    .subscribe(data =>{
      this.cursillob2 = data
      this.checked1 = this.cursillob2.cursbEstado;
      this.horaCursillo.setValue(this.cursillob2.cursbHora);
      this.nombreBautizo.setValue(this.cursillob2.cursbNombreb);
      this.nombreMadre.setValue(this.cursillob2.cursbNmadre);
      this.nombrePadre.setValue(this.cursillob2.cursbNpadre);
      this.date = new Date(this.cursillob2.cursbFecha.toString());
      console.log(this.cursillob2.cursbLugar);
      this.dis = true;
    });
  }

  /*-----------------------MÉTODO PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
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