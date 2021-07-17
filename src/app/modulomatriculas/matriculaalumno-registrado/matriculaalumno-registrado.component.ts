import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { matriculaAlumno } from './matriculaAlumno';
import { MatriculaService } from './matricula.service';
import { Periodo } from '../administrar-Periodos/Periodoservicio';
import { AdministrarPeriodoComponentservice } from '../administrar-Periodos/Periodo.service';
import { Table, TableModule } from 'primeng/table';
import Swal from 'sweetalert2';
import { tipoInscripcion } from '../administrar-tipo-inscripcion/tipoInscripcion';
import { tipoInscripcionService } from '../administrar-tipo-inscripcion/tipoInscripcion.service';
import { Nivel } from '../administrar-Niveles/Nivelservicio';
import { administarnivelservice } from '../administrar-Niveles/Nivel.service';
@Component({
  selector: 'app-matriculaalumno-registrado',
  templateUrl: './matriculaalumno-registrado.component.html'
})
export class MatriculaalumnoRegistradoComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE ADMINISTRAR MATRÍCULAS-----------------------*/
  servicio = new Array<matriculaAlumno>();
  serviciosMatriculas = new Array<matriculaAlumno>();
  ListaMatriculaxPeriodo = new Array<matriculaAlumno>();
  private servicio2: matriculaAlumno = new matriculaAlumno();
  addForm2: FormGroup;
  dis: boolean;
  dis2: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  dateInicio : Date = new Date;
  dateFin : Date = new Date;

  Periodos : Periodo[];
  PersiodoSelec : Periodo = new Periodo();
  PersiodoSelecInicio : Periodo;
  PersiodoSelecFin : Periodo;

  Niveles  :Nivel[];
  NivelSelect : Nivel;

  banderaMatPeriodo : Boolean = true;
  addFormMatricula: FormGroup;

  numeroReporte : number;
  checked2: Boolean=false;
  checked1: Boolean=false;

  ListaDeLugares : LugarEstudio[];
  LugarSelect : LugarEstudio;

  TipoInscripciones : tipoInscripcion[];
  tipoInscripcionSelect : tipoInscripcion;

  editarMatricula : matriculaAlumno= new matriculaAlumno();

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: MatriculaService ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private NivelServicio : administarnivelservice,
    private PeriodoServicio  : AdministrarPeriodoComponentservice,
    private TipoInscripcionServicio : tipoInscripcionService,
    private changeDetectorRefs: ChangeDetectorRef
  ){ 

  }

  ngOnInit() {

    /*-----------------------DECLARAMOS LOS LUGARES DE ESTUDIO QUE PUEDE TENER UNA MATRÍCULA-----------------------*/
    this.ListaDeLugares=[
      {nombre:"Centro Parroquial", ubicacion:"Parroquia San Joaquín"},
      {nombre:"Soldados", ubicacion:"Parroquia San Joaquín"},
      {nombre:"Sustag", ubicacion:"Parroquia San Joaquín"},
      {nombre:"Inmaculada", ubicacion:"Parroquia San Joaquín"},
      {nombre:"San Jose de Barabon", ubicacion:"Parroquia San Joaquín"},
      {nombre:"El Cañaro", ubicacion:"Parroquia San Joaquín"},
      {nombre:"Pinchizana", ubicacion:"Parroquia San Joaquín"},
      {nombre:"Turupamba", ubicacion:"Parroquia San Joaquín"}
    ]
    
    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL REGISTRO DE LA MATRÍCULA-----------------------*/
    this.addFormMatricula = this.formBuilder.group({
      matr_fk_tipoinscrpcion: ['', Validators.required],
      matr_fk_periodo: ['', Validators.required],
      matr_fk_nivel: ['', Validators.required],
      costoMatricula: ['', Validators.required],
      matr_lugar : ['', Validators.required],
      matr_fk_periodofin : ['', Validators.required],
      alumnoNombre : ['', Validators.required],
      alumnoCedula : ['', Validators.required],

    });

    /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA LISTAR TODOS LOS TIPOS DE INSCRIPCIÓN Y ALMACENAMOS-----------------------*/
    this.TipoInscripcionServicio.getTipoInscripciones().subscribe(data => {
      this.TipoInscripciones = data;
    });

     /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS-----------------------*/
    this.addForm2 = this.formBuilder.group({
      tipe_id: ['', Validators.required],
      tipe_serviciop: ['', Validators.required],
      tipe_descripcion: ['', Validators.required]
    });

    /*-----------------------LLAMAMOS AL SERVICIO DE NIVELES. EL METÓDO PARA LISTAR TODOS LOS NIVELES Y ALMACENAMOS-----------------------*/
    this.NivelServicio.getServicios().subscribe(data => {
      this.Niveles = data;
    });
 
    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR LAS MATRÍCULAS-----------------------*/
    this.listarMatriculas();

    /*-----------------------LLAMAMOS AL SERVICIO DE PERIODOS. EL METÓDO PARA LISTAR TODOS LOS PERIODOS Y ALMACENAMOS-----------------------*/
    this.PeriodoServicio.getServicios().subscribe(data => {
      this.Periodos = data;
    });

  }

  /*-----------------------MÉTODOS PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
  get matr_fk_tipoinscrpcion(){return this.addFormMatricula.get('matr_fk_tipoinscrpcion');}
  get matr_fk_periodo(){return this.addFormMatricula.get('matr_fk_periodo');}
  get matr_fk_nivel(){return this.addFormMatricula.get('matr_fk_nivel');}
  get matr_lugar(){return this.addFormMatricula.get('matr_lugar');}
  get persAula(){return this.addFormMatricula.get('persAula');}
  get alumnoNombre(){return this.addFormMatricula.get('alumnoNombre');}
  get alumnoCedula(){return this.addFormMatricula.get('alumnoCedula');}
  get costoMatricula(){return this.addFormMatricula.get('costoMatricula');}

  /*-----------------------MÉTODOS PARA CAMBIAR DE ESTADO VARIABLES DE TIPO BOOLEAN-----------------------*/
  handleChange2(e) {
    this.checked2 = e.checked;
  }

  handleChange1(e) {
    this.checked1 = e.checked;
  }

  /*-----------------------METÓDO QUE HABILITA LA VENTANA DE VISTA PREVIA DE UN REPORTE DE UNA MATRÍCULA-----------------------*/
  showDialog() {
    this.dis = true;
  }

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA GESTIONAR UNA MATRÍCULA-----------------------*/
  showModalDialog(){
    this.dis2 =true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULAS. EL METÓDO PARA LISTAR TODAS LAS MATRÍCULAS-----------------------*/
  listarMatriculas(){
    this.servicioService.getMatriculas().subscribe(servicio => {
      this.servicio = servicio;
      this.buscarporPeriodo();
      console.log("Matrículas actualizadas");
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULA. EL METÓDO PARA ELIMINAR UNA MATRÍCULA MEDIANTE EL ID-----------------------*/
  delete(servicio:matriculaAlumno): void {
    Swal.fire({
      title:'Eliminar Matrícula',
      text: `¿Esta seguro de eliminar la Matrícula del alumno ${servicio.matrFkAlumno.alumFkPersona.persNombre} ${servicio.matrFkAlumno.alumFkPersona.persApellido} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText :'Cancelar'
    }).then((result)=>{
    if(result.isConfirmed){
      this.servicioService.deleteMatricula(servicio.matrId).subscribe(
        response => {
          this.servicio = this.servicio.filter(servi => servi !== servicio)
          this.listarMatriculas();
        }
      )
      Swal.fire('Matrícula eliminada correctamente!','','success')
    }else if(result.isDenied){
      Swal.fire('Eliminación cancelada!','','error')
    }
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULA. EL METÓDO PARA ACTUALIZAR UNA MATRÍCULA-----------------------*/
  public update(): void {
    this.servicioService.updateMatricula(this.servicio2).subscribe(cliente => {
      this.dis = false;
      this.listarMatriculas();
    })
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULA. EL METÓDO PARA BUSCAR UNA MATRÍCULA MEDIANTE EL ID-----------------------*/
  cargarMatricula(matricula: matriculaAlumno): void {
    this.addFormMatricula.reset();
    localStorage.setItem("matrId", matricula.matrId.toString());
    let tipeId = localStorage.getItem('matrId');
    this.servicioService.getMatricula(+tipeId)
    .subscribe(data =>{
      this.editarMatricula = data
      this.checked1 = this.editarMatricula.matrEstadonivelapro;
      this.checked2 = this.editarMatricula.matrEstado;
      this.alumnoNombre.setValue(this.editarMatricula.matrFkAlumno.alumFkPersona.persNombre+" "+this.editarMatricula.matrFkAlumno.alumFkPersona.persApellido);
      this.alumnoCedula.setValue(this.editarMatricula.matrFkAlumno.alumFkPersona.persCedula+"");
      console.log(this.editarMatricula.matrFkPeriodo.periFin);
      this.dis = true;
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULA. EL METÓDO PARA ACTUALIZAR UNA MATRÍCULA-----------------------*/
  ActualizarDatos(){
    if (this.addFormMatricula.invalid) {
      this.dis=false;
      Swal.fire(
        'Error al Actualizar',
         `Existen campos erróneos`,
        "error")
      return;
    }else{
      this.editarMatricula.matrEstadonivelapro =this.checked1;
      this.editarMatricula.matrEstado = this.checked2;
      this.servicioService.updateMatricula(this.editarMatricula).subscribe(data =>{
        this.dis=false;
        Swal.fire(
          'Actualizado Existosamente',
           `Se actualizo la matrícula correctamente`,
        "success")
        this.addFormMatricula.reset();
        this.listarMatriculas();
      });
    }
  }

  /*-----------------------METÓDO PARA BUSCAR MATRÍCULAS POR DETERMINADOS PERIODOS-----------------------*/
  buscarporPeriodo(){
    try{
      this.ListaMatriculaxPeriodo=[];
      this.banderaMatPeriodo =false;
      this.serviciosMatriculas = this.servicio;
      var cons = 0;
      for (let index = 0; index < this.serviciosMatriculas.length; index++) {
        if(this.PersiodoSelec.periInicio == this.serviciosMatriculas[index].matrFkPeriodo.periInicio){
          this.ListaMatriculaxPeriodo.push(this.serviciosMatriculas[index]);
          cons++;
        }
      }
      this.dateInicio = new Date(this.PersiodoSelec.periInicio.toString());
      this.dateFin = new Date(this.PersiodoSelec.periFin.toString());
      console.log("El número de matriculados en este periodo es: " + cons);
      this.serviciosMatriculas = this.ListaMatriculaxPeriodo;
      this.banderaMatPeriodo=true;
      this.reload('matriculas/administrar/matriculados');
    }catch(e){
    }
  }

  /*-----------------------METÓDO ACTUALIZAR LA VENTA DE ADMINISTRAR MATRÍCULA-----------------------*/ 
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('matriculas/administrar/matriculados', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
}

/*-----------------------INTERFAZ DE LUGAR DE ESTUDIO DE LA MATRÍCULA-----------------------*/
interface LugarEstudio{
  nombre : string;
  ubicacion: string ; 
}
