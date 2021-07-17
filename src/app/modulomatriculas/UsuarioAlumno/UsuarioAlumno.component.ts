import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Alumno} from '../AdministrarAulmno/AdministrarAlumnoservicio';
import { UsuarioAlumnosservice } from './UsuarioAlumno.service';
import Swal from 'sweetalert2';
import { tipoInscripcion } from '../administrar-tipo-inscripcion/tipoInscripcion';
import { tipoInscripcionService } from '../administrar-tipo-inscripcion/tipoInscripcion.service';
import { Nivel } from '../administrar-Niveles/Nivelservicio';
import { administarnivelservice } from '../administrar-Niveles/Nivel.service';
import { AdministrarPeriodoComponentservice } from '../administrar-Periodos/Periodo.service';
import { Periodo } from '../administrar-Periodos/Periodoservicio';
import { Representante } from '../administrarrepresentantes/representantesEjemplo';
import { matriculaAlumno } from '../matriculaalumno-registrado/matriculaAlumno';
import { MatriculaService } from '../matriculaalumno-registrado/matricula.service';
import { RepresentanteService } from '../administrarrepresentantes/administrarrepresentantes.service';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import { pdf } from '@progress/kendo-drawing';


@Component({
  selector: 'app-servicioslista',
  templateUrl: './Usuario.component.html'
})

export class UsuarioAlumnosComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE INGRESO DE MATRÍCULAS-----------------------*/
  servicio: Alumno[];
  private servicio2: Alumno = new Alumno();
  addForm2: FormGroup;
  
  addFormAlumno: FormGroup;
  addFormAlumnoExistente : FormGroup;
  addFormPadres: FormGroup;
  addFormMatricula: FormGroup;
  dis:Boolean =false;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  disMadre: boolean;
  disPadre: boolean;
  checked1: Boolean=false;
  checked2: Boolean=false;
  checked3: Boolean=true;
  numerico :boolean =false;

  PersonasLista: Persona[];
  cedulacorrecta: boolean;

  TipoInscripciones : tipoInscripcion[];
  tipoInscripcionSelect : tipoInscripcion;

  Niveles  :Nivel[];
  NivelSelect : Nivel;

  Periodos : Periodo[];
  PersiodoSelec : Periodo;

  RepresentanteModelo : representante[];
  representateSelect : representante;
  repParentesco : string;

  PersonaRepresentante : Persona;
  PersonaFiltrada: Persona;
  PersonaAlumno : Persona ;
  persona2 : Persona = new Persona();

  selectOtro: boolean=false;
  selectMadre: boolean=false;
  selectPadre: boolean=false;

  EstudiantePersonaExistente: boolean =false;

  AlumnoNuevo : Alumno;
  Alumnos : Alumno[];

  RepresentanteAlumno : Representante;

  MatriculaAlumno : matriculaAlumno;
  Matriculas : matriculaAlumno[];
  
  DateNacimiento : Date = new Date();
  DateBautizo : Date = new Date();
  DateActual : Date =new Date();

  DateInicioMatricula : Date;
  DateFinMatricula : Date;

  banderaAlumno : Boolean =false;
  banderaAlumnoExistente : Boolean =false;

  banderaPestanaRepresentante : Boolean = false;
  banderaPestanaMatricula : Boolean = false;
  banderaPestanaAlumno : Boolean = true;
  seleccionAlum : Boolean = false;
  seleccionRepres : Boolean = true;
  seleccionMatri : Boolean = true;
  bandera3: Boolean=false;
  
  cedNuevoAlumno: string;

  ListaRepresentantes : Representante[];

  periodoInincio: String ="";
  periodoFin: String ="";
  tipoInscripcion: String = "";
  nivelInscrito: String = "";
  lugarEstudio: String ="San Joaquín";
  nombreAlumno: String = "";
  apellidoAlumno :String = "";
  cedualaAlumno : String = "";
  telefonoAlumno: String ="";
  direccionAlumno: String = "";
  emailAlumno : String = ""; 
  nombreRepresentante: String = "";
  apellidoRepresentante :String = "";
  cedualaRepresentante : String = "";
  telefonoRepresentante: String ="";
  direccionRepresentante: String = "";
  emailRepresentante : String = ""; 
  parentescoRespresentante :String = "";

  disADDRepresentante :boolean; 

  ListaDeLugares : LugarEstudio[];
  LugarSelect : LugarEstudio;

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: UsuarioAlumnosservice ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private PersonaServicio: PersonaService,
    private TipoInscripcionServicio : tipoInscripcionService,
    private NivelServicio : administarnivelservice,
    private PeriodoServicio  : AdministrarPeriodoComponentservice,
    private MatriculaServicio : MatriculaService,
    private AlumnoServicio : UsuarioAlumnosservice,
    private RepresentanteServicio : RepresentanteService
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

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL ALUMNO-----------------------*/
    this.addForm2 = this.formBuilder.group({
      inse_id: [''],
      inse_cedula: ['', Validators.required],
      inse_nombre: ['', Validators.required],
      inse_apellido: ['', Validators.required],
      inse_email: ['', Validators.required],
      inse_telefono: ['', Validators.required],
      inse_direccion: ['', Validators.required],
      inse_fechanaci: ['', Validators.required],
      inse_fechabautizo: ['', Validators.required]
    });
  
    /*-----------------------LLAMAMOS AL SERVICIO DE ALUMNOS. EL METÓDO PARA LISTAR TODOS LOS ALUMNOS Y ALMACENAMOS-----------------------*/
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );

    /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA LISTAR TODOS LOS TIPOS DE INSCRIPCIÓN Y ALMACENAMOS-----------------------*/
    this.TipoInscripcionServicio.getTipoInscripciones().subscribe(data => {
      this.TipoInscripciones = data;
    });

    /*-----------------------LLAMAMOS AL SERVICIO DE PERIODOS. EL METÓDO PARA LISTAR TODOS LOS PERIODOS Y ALMACENAMOS-----------------------*/
    this.PeriodoServicio.getServicios().subscribe(data => {
      this.Periodos = data;
    });

    /*-----------------------LLAMAMOS AL SERVICIO DE NIVELES. EL METÓDO PARA LISTAR TODOS LOS NIVELES Y ALMACENAMOS-----------------------*/
    this.NivelServicio.getServicios().subscribe(data => {
      this.Niveles = data;
    });

    /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULAS. EL METÓDO PARA LISTAR TODAS LAS MATRÍCULAS-----------------------*/
    this.MatriculaServicio.getMatriculas().subscribe(data => {
      this.Matriculas = data;
    });

    /*-----------------------DECLARAMOS LOS TIPOS DE RESPRESENTANTES QUE PUEDE TENER UNA MATRÍCULA-----------------------*/
    this.RepresentanteModelo = [
      {name: 'Madre', parentesco:"Madre"},
      {name: 'Padre', parentesco:"Padre"},
      {name: 'Otro', parentesco:"Otros"}
    ];

    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR TODAS LA PERSONAS-----------------------*/
    this.ListarPersonas();
    this.MatriculaAlumno = new matriculaAlumno();
    this.AlumnoNuevo= new Alumno();
    this.RepresentanteAlumno = new Representante();

    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR TODOS LOS ALUMNOS-----------------------*/
    this.ListarAlumnos();

    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR LOS REPRESENTANTES-----------------------*/
    this.ListarRepresentantes();

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL ALUMNO-----------------------*/
    this.addFormAlumno = this.formBuilder.group({
      persCedula: ['', Validators.required],
      persNombre: ['', Validators.required],
      persApellido: ['', Validators.required],
      persfechabautismo: ['', Validators.required],
      persDireccion: ['', Validators.required],
      persTelefono: ['', Validators.required],
      persfechanacimiento: ['', Validators.required],
      persEmail: ['', Validators.required],
    });

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DE UN ALUMNO EXISTENTE-----------------------*/
    this.addFormAlumnoExistente = this.formBuilder.group({
      persCedula: ['', Validators.required],
      persNombre: ['', Validators.required],
      persApellido: ['', Validators.required],
      persDireccion: ['', Validators.required],
      persTelefono: ['', Validators.required],
      persEmail: ['', Validators.required],
    });

     /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL REPRESENTANTE DE UN ALUMNO-----------------------*/
    this.addFormPadres = this.formBuilder.group({
      persRepresentante: ['', Validators.required],
      repreCedula: ['',Validators.required],
      repreNombre: ['',Validators.required],
      repreApellido: ['',Validators.required],
      repreParentesco: ['',Validators.required]
    });

     /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO DE DATOS DEL REGISTRO DE LA MATRICULA-----------------------*/
    this.addFormMatricula = this.formBuilder.group({
      matr_fk_tipoinscrpcion: ['', Validators.required],
      matr_fk_periodo: ['', Validators.required],
      matr_fk_nivel: ['', Validators.required],
      costoMatricula: ['', Validators.required],
      matr_lugar : ['', Validators.required],
      persAula: [''],
    });
    
  }

  /*-----------------------MÉTODOS PARA RECUPERAR VALORES DE LOS DIFERENTES FORMULARIOS Y SUS CAMPOS-----------------------*/
  get persEmail(){return this.addFormAlumno.get('persEmail');}
  get persCedula(){return this.addFormAlumno.get('persCedula');}
  get persNombre(){return this.addFormAlumno.get('persNombre');}
  get persApellido(){return this.addFormAlumno.get('persApellido');}
  get persDireccion(){return this.addFormAlumno.get('persDireccion');}
  get persTelefono(){return this.addFormAlumno.get('persTelefono');}

  get persEmailExistente(){return this.addFormAlumnoExistente.get('persEmail');}
  get persCedulaExistente(){return this.addFormAlumnoExistente.get('persCedula');}
  get persNombreExistente(){return this.addFormAlumnoExistente.get('persNombre');}
  get persApellidoExistente(){return this.addFormAlumnoExistente.get('persApellido');}
  get persDireccionExistente(){return this.addFormAlumnoExistente.get('persDireccion');}
  get persTelefonoExistente(){return this.addFormAlumnoExistente.get('persTelefono');}

  get persfechanacimiento(){return this.addFormAlumno.get('persfechanacimiento');}
  get persfechabautismo(){return this.addFormAlumno.get('persfechabautismo');}
 
  get repreCedula(){return this.addFormPadres.get('repreCedula');}
  get repreNombre(){return this.addFormPadres.get('repreNombre');}
  get repreParentesco(){return this.addFormPadres.get('repreParentesco');}
  get repreApellido(){return this.addFormPadres.get('repreApellido');}
  get matr_fk_tipoinscrpcion(){return this.addFormMatricula.get('matr_fk_tipoinscrpcion');}
  get matr_fk_periodo(){return this.addFormMatricula.get('matr_fk_periodo');}
  get matr_fk_nivel(){return this.addFormMatricula.get('matr_fk_nivel');}
  get matr_lugar(){return this.addFormMatricula.get('matr_lugar');}
  get persAula(){return this.addFormMatricula.get('persAula');}
  get persRepresentante(){return this.addFormPadres.get('persRepresentante');}
  get costoMatricula(){return this.addFormMatricula.get('costoMatricula');}

  get inse_cedula(){return this.addForm2.get('inse_cedula');}
  get inse_nombre(){return this.addForm2.get('inse_nombre');}
  get inse_apellido(){return this.addForm2.get('inse_apellido');}
  get inse_email(){return this.addForm2.get('inse_email');}
  get inse_telefono(){return this.addForm2.get('inse_telefono');}
  get inse_direccion(){return this.addForm2.get('inse_direccion');}
  get inse_fechanaci(){return this.addForm2.get('inse_fechanaci');}
  get inse_fechabautizo(){return this.addForm2.get('inse_fechabautizo');}

  /*-----------------------METÓDO QUE HABILITA LA VENTANA DE VISTA PREVIA DE UN REPORTE DE UNA MATRÍCULA-----------------------*/
  showDialog() {
    this.dis = true;
  }

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA CREAR UN NUEVO REPRESENTANTE-----------------------*/
  crearRepresentante(){
    this.disADDRepresentante=true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA LISTAR TODAS LAS PERSONAS Y ALMACENAMOS-----------------------*/
  ListarPersonas(){
    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE ALUMNOS. EL METÓDO PARA LISTAR TODOS LOS ALUMNOS Y ALMACENAMOS-----------------------*/
  ListarAlumnos(){
    this.AlumnoServicio.getServicios().subscribe(data => {
      this.Alumnos = data;
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE REPRESENTANTES. EL METÓDO PARA LISTAR TODOS LOS REPRESENTANTES Y ALMACENAMOS-----------------------*/
  ListarRepresentantes(){
    this.RepresentanteServicio.getRepresentantes().subscribe(data => {
      this.ListaRepresentantes = data;
    });
  }

  /*-----------------------METÓDO QUE HABILITA LA GESTIÓN PARA LA MATRÍCULA DE UN ALUMNO NUEVO-----------------------*/
  SeleccionNuevoAlumno(){
    this.banderaAlumno = true;
    this.banderaAlumnoExistente  =false;
  }

  /*-----------------------METÓDO QUE HABILITA LA GESTIÓN PARA LA MATRÍCULA DE UN ALUMNO EXISTENTE-----------------------*/
  seleccionAlumnoExistente(){
    this.banderaAlumno = false;
    this.banderaAlumnoExistente  =true;
  }

  /*-----------------------METÓDO QUE VUELVE AL PRINCIPIO DE LA MATRÍCULA-----------------------*/
  volverSeleccionAlumno(){
    this.pestanaAlumno();
  }

  /*-----------------------METÓDO QUE NOS PERMITE GESTIONAR LA MATRÍCULA DE UN ALUMNO NUEVO-----------------------*/
  pestanaAlumno(){
    this.banderaAlumno  =false;
    this.banderaAlumnoExistente  =false;
    this.banderaPestanaRepresentante  = false;
    this.banderaPestanaMatricula = false;
    this.banderaPestanaAlumno  = true;
    this.seleccionAlum = false;
    this.seleccionRepres  = true;
    this.seleccionMatri  = true;
    this.checked1=false;
    this.checked2=false;
    this.numerico=false;
    this.EstudiantePersonaExistente=false;
    this.addFormAlumnoExistente.reset();
    this.addFormAlumno.reset();
    this.addFormPadres.reset();
    this.addFormMatricula.reset();
  }

  /*-----------------------METÓDO QUE NOS PERMITE GESTIONAR EL REPRESENTANTE DEL ALUMNO-----------------------*/
  pestanaRepresentante(){
    this.banderaAlumno=false;
    this.banderaPestanaRepresentante = true;
    this.banderaPestanaAlumno=false;
    this.seleccionAlum=true;
    this.seleccionRepres=false;
  }

  /*-----------------------METÓDO QUE NOS PERMITE GESTIONAR LA INOFRMACIÓN SOBRE EL REGISTRO DE LA MATRÍCULA-----------------------*/
  pestanaMatricula(){
    this.banderaPestanaRepresentante = false;
    this.banderaPestanaMatricula=true;
    this.seleccionAlum=true;
    this.seleccionMatri=false;
    this.seleccionRepres=true;
  }

  /*-----------------------METÓDO QUE CANCELA  EL REGISTRO DE LA MATRÍCULA-----------------------*/
  cancelarMatriculaDatosRepreAExis(){
    this.addFormAlumno.reset();
    this.addFormPadres.reset();
    this.pestanaAlumno();
    Swal.fire(
      'Matricula cancelada.'
    )
  }

  /*-----------------------METÓDO QUE PROCEDE CON EL PASO DE INFORMACIÓN DE LA MATRÍCULA-----------------------*/
  siguientePaso(){
    this.pestanaMatricula();
  }

  /*-----------------------METÓDO QUE CANCELA  EL REGISTRO DE LA MATRÍCULA DESDE LA VENTANA DE REPRESENTANTES-----------------------*/
  cancelarMatriculaDatosRepre(){
    this.addFormAlumno.reset();
    this.addFormPadres.reset();
    this.pestanaAlumno();
    Swal.fire(
      'Matricula cancelada.'
    )
    try{
      this.PersonaAlumno =  this.buscarCedula(this.cedNuevoAlumno);
      this.PersonaServicio.delete(this.PersonaAlumno.persid).subscribe(
      response => {
        this.PersonasLista = this.PersonasLista.filter(servi => servi !== this.PersonaAlumno)
        console.log("Matricula Desecha")
      })
    }catch(e){

    }
  }

  /*-----------------------MÉTODO PARA INCLUIR EVENTOS EN EL CAMBION DEL TAB-PANEL-----------------------*/
  onTabChange(event) {}

  /*-----------------------MÉTODO PARA CAMBIAR DE ESTADO VARIABLES DE TIPO BOOLEAN-----------------------*/
  handleChange(e) {
    this.checked1 = e.checked;
  }

  handleChange2(e) {
    this.checked2 = e.checked;
  }
  handleChange3(e) {
    this.checked3 = e.checked;
  }

  /*-----------------------MÉTODO PARA CANCELAR EL INGRESO DE UN REPRESENTANTE-----------------------*/
  cerrarCargarRepresentante(){
    this.disADDRepresentante=false;
    this.addForm2.reset();
    this.persona2 = new Persona();
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL MÉTODO PARA INGRESAR UNA PERSONA NUEVA AL MOMENTO DE REGISTRAR UN NUEVO REPRESENTANTE-----------------------*/
  crearPersonaRepresentante(){
    if (this.addForm2.invalid) {
      Swal.fire(
        'Registro erroneo',
        'Existen campos vacios o erroneos',
        'error');
        return;
    }else{
      this.PersonaRepresentante = this.persona2;
      this.PersonaServicio.create(this.persona2).subscribe(
        Response => {
          Swal.fire(
          'Representante Registrado',
          'El representante se registro correctamente',
          'success')
          this.disADDRepresentante=false;
        }
      );
    }
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE REPRESENTANTES. EL MÉTODO PARA INGRESAR UN NUEVO REPRESENTANTE-----------------------*/
  GuardarRepresentante(personaRepresentante: Persona, repreBandera : Boolean , parentesco : string, alumno :Alumno){
    var ban : Boolean=false;
    for (var i=0; i<this.ListaRepresentantes.length; i++){ 
      if((personaRepresentante.persCedula == this.ListaRepresentantes[i].padrFkPersona.persCedula) && (alumno.alumId==this.ListaRepresentantes[i].padrFkAlumno.alumId)){
        ban =true;
      }
    }
    if(ban==false){
      this.RepresentanteAlumno.padrFkAlumno = alumno;
      this.RepresentanteAlumno.padrFkPersona = personaRepresentante;
      this.RepresentanteAlumno.padrParentesco=parentesco;
      this.RepresentanteAlumno.padrRepresentante=repreBandera;
      console.log("Representante: ");
      console.log(this.RepresentanteAlumno);
      this.RepresentanteServicio.createRepresentante(this.RepresentanteAlumno).subscribe(data =>{
        console.log("Representante creado Correctamente: " + this.RepresentanteAlumno.padrParentesco);
      });
    }
  }

  /*-----------------------MÉTODO PARA VALIDAR CAMPOS NUMERICOS-----------------------*/
  validarCamposNumericos(){
    var valoresAceptados = /^[0-9]+$/;
    var cedula :String;
    var telefono :String;
    cedula = this.addFormAlumno.get("persCedula").value+"";
    telefono = this.addFormAlumno.get("persTelefono").value+"";
    if (telefono.match(valoresAceptados) && cedula.match(valoresAceptados)) {
      this.numerico = true;
      console.log("Cedula  && Telefono son NUMEROS")
    } else {
      this.numerico = false;
      console.log("Cedula o Telefono contienen letras")
    }
  }
  
  /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL MÉTODO PARA INGRESAR UNA PERSONA NUEVA AL MOMENTO DE REGISTRAR UN NUEVO ALUMNO-----------------------*/
  RegistrarPersonaAlumno(){
    this.validarCamposNumericos();
    var restPersona :boolean =false;
    var banFBautizo :boolean =false;
    var banEstudianteRegistrado :boolean=false;
    var result : number = 0;
    result = this.DateActual.getFullYear()-this.DateNacimiento.getFullYear();
    console.log("Edad aproximada: "+ result + "años");
    

    if (this.EstudiantePersonaExistente==false) {
      for (let index = 0; index < this.PersonasLista.length; index++) {
        if(this.addFormAlumno.value.persCedula == this.PersonasLista[index].persCedula){
          this.PersonaFiltrada =  this.PersonasLista[index];
          restPersona = true;
        }
      }
    }
    
    for (let index = 0; index < this.servicio.length; index++) {
      if(this.addFormAlumno.value.persCedula == this.servicio[index].alumFkPersona.persCedula){
        banEstudianteRegistrado = true;
      }
    }


    if(this.DateBautizo.getTime() <= this.DateNacimiento.getTime()){
      banFBautizo=true
      console.log("La Fecha de Bautizo es erronea.")
    }

    if (this.addFormAlumno.invalid) {
      Swal.fire(
        'Datos Erroneos',
        'Existe información erronea o campos vacios. Necesarios para el siguiente paso',
        'error'
      );
      return;
    }else{
      if(this.numerico==false){
        this.numerico=true;
        Swal.fire(
          'Campos numericos erroneos',
          'El número de cédula o teléfono contienen letras',
          'error'
        );
        return;
      }else{
        if (banEstudianteRegistrado==true) {
          Swal.fire(
            'Alumno Registrado',
            'El número de cédula ya esta registrado dentro de alumno. Verificar información.',
            'error'
          );
          return;
        }else{
          if(restPersona==true){
            Swal.fire({
              title: 'Persona ya registrada',
              text:'El número de cédula ya se encuentra registrado. ¿Desea cargar la información?',
              showDenyButton: true,
              confirmButtonText: `Cargar`,
              denyButtonText: `Corregir`,
            }).then((result) => {
              if (result.isConfirmed) {
                this.DateBautizo = new Date(this.PersonaFiltrada.persfechabautismo);
                this.DateNacimiento = new Date(this.PersonaFiltrada.persfechanacimiento);
                this.persNombre.setValue(this.PersonaFiltrada.persNombre);
                this.persApellido.setValue(this.PersonaFiltrada.persApellido);
                this.persDireccion.setValue(this.PersonaFiltrada.persDireccion);
                this.persTelefono.setValue(this.PersonaFiltrada.persTelefono);
                this.persEmail.setValue(this.PersonaFiltrada.persEmail);
                this.EstudiantePersonaExistente=true;
                Swal.fire('Información cargada correctamente.', 'Verifique si necesita actualizar la información', 'success')
                return;
              } else if (result.isDenied) {
                this.EstudiantePersonaExistente=false;
                Swal.fire('Verifique el número de cédula que no exista en el sistema.', '', 'error')
                this.persCedula.setValue("");
                return;
              }
            })
          }else{
            this.validadorDeCedula(this.addFormAlumno.value.persCedula);
            if(this.cedulacorrecta==true){
              if(result>6){
                if(banFBautizo==true){
                  Swal.fire(
                    'Fecha de Bautizmo Erronea',
                    'La Fecha del bautismo no puede ser antes o la misma fecha de nacimiento',
                    'error'
                  );
                  return;
                }else{
                  this.cedNuevoAlumno =  this.addFormAlumno.get('persCedula').value;
                  if (this.EstudiantePersonaExistente==true) {
                    
                    this.PersonaFiltrada.persNombre = this.addFormAlumno.value.persNombre;
                    this.PersonaFiltrada.persApellido = this.addFormAlumno.value.persApellido;
                    this.PersonaFiltrada.persDireccion = this.addFormAlumno.value.persDireccion;
                    this.PersonaFiltrada.persEmail= this.addFormAlumno.value.persEmail;
                    this.PersonaFiltrada.persTelefono = this.addFormAlumno.value.persTelefono;
  
                    this.PersonaServicio.update(this.PersonaFiltrada).subscribe(data =>{
                      console.log("Persona Actualizada");
                      this.pestanaRepresentante();
                    });
                  }else{
                    this.PersonaServicio.create(this.addFormAlumno.value).subscribe(data => {
                      console.log("Persona creada Correctamente" + data);
                      this.pestanaRepresentante();
                    });
                  }
                }
              }else{
                Swal.fire(
                  'Edad no permitida',
                  'La edad no es acta para la inscripción de la Catequesís. Edad minima de 7 años',
                  'error'
                );
                return;
              }
            }else{
              Swal.fire(
                'Cédula Invalida',
                'El numero de cédula no es correcto.',
                'error'
              );
              return;
            }
          }
        }
        
      }
      
    }
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE ALUMNOS. EL MÉTODO PARA INGRESAR UN ALUMNOS NUEVO-----------------------*/
  RegistrarAlumno(){
    if (this.addFormPadres.invalid) {
      Swal.fire(
        'Datos Erroneos',
        'Existe información erronea o campos vacios. Necesarios para el siguiente paso',
        'error'
      );
      return;
    }else{
      this.PersonaRepresentante = this.buscarCedula(this.addFormPadres.value.repreCedula);
      this.PersonaAlumno = this.buscarCedula(this.cedNuevoAlumno);
      this.AlumnoNuevo.alumFkPersona = this.buscarCedula(this.cedNuevoAlumno);
      console.log(this.AlumnoNuevo);
      this.AlumnoServicio.createAl(this.AlumnoNuevo).subscribe(data => {
        console.log("Alumno creado Correctamente" + data);
        this.ListarAlumnos();
        this.pestanaMatricula();
      });
    }
  }

  /*-----------------------METÓDO PARA CARGAR DATOS AL REPORTE DE LA MATRÍCULA REGISTRADA-----------------------*/
  cargarDatosReporte(){
    this.dis=true;
    this.PersonaAlumno = this.buscarCedula(this.cedNuevoAlumno);
    this.periodoInincio = this.PersiodoSelec.periInicio.toString();
    this.periodoFin = this.PersiodoSelec.periFin.toString();
    this.lugarEstudio=this.LugarSelect.nombre;
    this.tipoInscripcion = this.tipoInscripcionSelect.tipiNombre.toString();
    this.nivelInscrito = this.NivelSelect.niveNombre.toString();

    this.nombreAlumno = this.AlumnoNuevo.alumFkPersona.persNombre.toString();
    this.apellidoAlumno = this.AlumnoNuevo.alumFkPersona.persApellido;
    this.cedualaAlumno = this.AlumnoNuevo.alumFkPersona.persCedula;
    this.telefonoAlumno = this.AlumnoNuevo.alumFkPersona.persTelefono;
    this.direccionAlumno = this.AlumnoNuevo.alumFkPersona.persDireccion;
    this.emailAlumno = this.AlumnoNuevo.alumFkPersona.persEmail;
    
    if(this.banderaAlumnoExistente==true){
      for (var i=0; i<this.ListaRepresentantes.length; i++){ 
        if((this.AlumnoNuevo.alumId == this.ListaRepresentantes[i].padrFkAlumno.alumId)){
          if(this.ListaRepresentantes[i].padrRepresentante==true){
            this.PersonaRepresentante =this.ListaRepresentantes[i].padrFkPersona;
            this.repParentesco = this.ListaRepresentantes[i].padrParentesco;
          }
        }
      }
    }else{
      this.PersonaRepresentante = this.persona2;
    }

    this.nombreRepresentante=  this.PersonaRepresentante.persNombre.toString();
    this.apellidoRepresentante =  this.PersonaRepresentante.persApellido;
    this.cedualaRepresentante =  this.PersonaRepresentante.persCedula;
    this.telefonoRepresentante =  this.PersonaRepresentante.persTelefono;
    this.direccionRepresentante =  this.PersonaRepresentante.persDireccion;
    this.emailRepresentante =  this.PersonaRepresentante.persEmail;
    this.parentescoRespresentante = this.repParentesco;
  }

  /*-----------------------METÓDO PARA CARGAR DATOS DE LA MATRÍCULA REGISTRADA ANTES DE GUARDAR-----------------------*/
  cargarDatosMatricula(){

    var banderaMatricula :boolean =false;
    try{
      for (let index = 0; index < this.Alumnos.length; index++) {
        if (this.cedNuevoAlumno == this.Alumnos[index].alumFkPersona.persCedula) {
          this.AlumnoNuevo =this.Alumnos[index];
        }
      }
      
      for (let index = 0; index < this.Matriculas.length; index++) {
        if(this.AlumnoNuevo.alumId == this.Matriculas[index].matrFkAlumno.alumId && this.PersiodoSelec.periInicio == this.Matriculas[index].matrFkPeriodo.periInicio){
          banderaMatricula=true;
        }
      }
    }catch(e){}

    if(banderaMatricula==false){
      this.MatriculaAlumno.matrEstado = this.checked2;
      this.MatriculaAlumno.matrFkAlumno = this.AlumnoNuevo;
      this.MatriculaAlumno.matrFkNivel = this.NivelSelect;
      this.MatriculaAlumno.matrFkPeriodo =this.PersiodoSelec;
      this.MatriculaAlumno.matrFkTipoinscrpcion = this.tipoInscripcionSelect;
      this.MatriculaAlumno.matrValor = this.addFormMatricula.get("costoMatricula").value;
      this.MatriculaAlumno.matrEstadonivelapro = false;
      this.MatriculaAlumno.matrLugar=this.LugarSelect.nombre;
      console.log("Matricula:");
      console.log(this.MatriculaAlumno);
      this.cargarDatosReporte();
      this.MatriculaServicio.createMatricula(this.MatriculaAlumno).subscribe(data => {
        Swal.fire(
        'Matricula Registrada',
        'La matricula se registro correctamente',
        'success')  
        console.log( this.MatriculaAlumno);
        if(this.banderaAlumnoExistente==false){
          this.PersonaRepresentante = this.buscarCedula(this.addFormPadres.value.repreCedula);
          this.GuardarRepresentante(this.PersonaRepresentante,true,this.addFormPadres.get('repreParentesco').value,this.AlumnoNuevo);
        }
        this.pestanaAlumno();
      });
    }else{
      Swal.fire(
        'Matricula erronea',
        'El alumno ya se encuentra registrado en un nivel en este periodo.',
        'error'
      );
    }
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULAS. EL MÉTODO PARA INGRESAR UNA MATRÍCULA NUEVA-----------------------*/
  RegistrarMatricula(){
    this.ListarAlumnos();
    if (this.addFormMatricula.invalid) {
      Swal.fire(
        'Matricula Erronea',
        'Existen campos erroneos o vacios.',
        'error')
      return;
    }else{
      this.cargarDatosMatricula();
    }
  }

  /*-----------------------METÓDO PARA BUSCAR A UNA PERSONA MEDIANTE LA CÉDULA-----------------------*/
  buscarCedula(cedula){
    this.ListarPersonas();
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
  }

  /*-----------------------METÓDO PARA BUSCAR UN ALUMNO EXISTENTE PARA UN REGISTRO DE MATRÍCULA-----------------------*/
  BuscarAlumnoExistente(){
    var banaux : Boolean = false;
    if(this.addFormAlumnoExistente.get("persCedula").value != ""){
      for (var i=0; i<this.Alumnos.length; i++){ 
        if(this.addFormAlumnoExistente.get("persCedula").value == this.Alumnos[i].alumFkPersona.persCedula){
          this.AlumnoNuevo = this.Alumnos[i];
          console.log(this.AlumnoNuevo);
          this.persNombreExistente.setValue( this.AlumnoNuevo.alumFkPersona.persNombre);
          this.persApellidoExistente.setValue(this.AlumnoNuevo.alumFkPersona.persApellido);
          this.persDireccionExistente.setValue(this.AlumnoNuevo.alumFkPersona.persDireccion);
          this.persTelefonoExistente.setValue(this.AlumnoNuevo.alumFkPersona.persTelefono);
          this.persEmailExistente.setValue(this.AlumnoNuevo.alumFkPersona.persEmail);
          banaux = false;
          return;
        }else{
          banaux = true;
        } 
      }
    }
    if(banaux){
      Swal.fire(
        'Alumno no existe',
        'Asegurese que el alumno cuente con un registro',
        'warning'
      );
      banaux = false;
    }
  }

  /*-----------------------METÓDO PARA BUSCAR LOS REPRESENTANTES DE UN ALUMNO EXISTENTE-----------------------*/
  CargarRepresentantesAlumno(){
    if (this.addFormAlumnoExistente.invalid) {
      Swal.fire(
        'Datos Erroneos',
        'Existe información erronea o campos vacios. Necesarios para el siguiente paso',
        'error'
      );
      return;
    }else{
      this.PersonaAlumno = this.AlumnoNuevo.alumFkPersona;
      this.PersonaAlumno.persEmail = this.addFormAlumnoExistente.get("persEmail").value;
      this.PersonaAlumno.persDireccion = this.addFormAlumnoExistente.get("persDireccion").value;
      this.PersonaAlumno.persTelefono = this.addFormAlumnoExistente.get("persTelefono").value;
      this.PersonaServicio.update(this.PersonaAlumno).subscribe(data =>{
        console.log("Actualizado");
        console.log(this.PersonaAlumno);
        this.pestanaRepresentante();
      });
      var ban : Boolean=false;
      for (var i=0; i<this.ListaRepresentantes.length; i++){ 
        if((this.AlumnoNuevo.alumId == this.ListaRepresentantes[i].padrFkAlumno.alumId)){
          this.selectOtro=true;
          this.repreApellido.setValue(this.ListaRepresentantes[i].padrFkPersona.persApellido);
          this.repreNombre.setValue(this.ListaRepresentantes[i].padrFkPersona.persNombre);
          this.repreCedula.setValue(this.ListaRepresentantes[i].padrFkPersona.persCedula);
          this.repreParentesco.setValue(this.ListaRepresentantes[i].padrParentesco);
        }
      }
    }
  }

  /*-----------------------METÓDO PARA BUSCAR UN REPRESENTANTE POR EL NUMERO DE CÉDULA-----------------------*/
  findbyCedulaRepresentante() {
    try{
      this.validadorDeCedula(this.addFormPadres.get('repreCedula').value);
      console.log(this.addFormPadres.get('repreCedula').value);
      this.PersonaRepresentante = this.buscarCedula(this.addFormPadres.get('repreCedula').value);
      if (this.PersonasLista.includes(this.PersonaRepresentante)){
        this.repreNombre.setValue(this.PersonaRepresentante.persNombre);
        this.repreApellido.setValue(this.PersonaRepresentante.persApellido);
      }else{
        Swal.fire({
          title: '¡Usuario no existe!',
          text: 'Desea agregar al representante ' + this.addFormPadres.get('repreCedula').value,
          showDenyButton: true,
          confirmButtonText: `Aceptar`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.crearRepresentante();
          } 
        })
      }
    }catch(e){

    }
  }

  /*-----------------------METÓDO QUE VERIFICA EL PARENTESCO DEL REPRESENTANTE-----------------------*/
  seleccionRepresentante(){
    if(this.representateSelect.name=="Otro"){
      this.repParentesco ="Otro";
      this.selectOtro = true;
      this.selectMadre = false;
      this.selectPadre = false;
      this.repreParentesco.setValue("");
    }else if(this.representateSelect.name=="Madre"){
      this.repParentesco ="Madre";
      this.selectMadre = true;
      this.selectOtro = false;
      this.selectPadre = false;
      this.repreParentesco.setValue("Madre");
    }else if(this.representateSelect.name=="Padre"){
      this.repParentesco ="Padre";
      this.selectOtro = false;
      this.selectMadre = false;
      this.selectPadre = true;
      this.repreParentesco.setValue("Padre");
    }else{
      return;
    }

  }

  /*-----------------------METÓDO PARA VALIDAR LA CÉDULA ECUATORIANA-----------------------*/
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
    this.cedulacorrecta = cedulaCorrecta;
  }
}

/*-----------------------INTERFAZ DEL PARENTESCO DEL REPRESENTANTE DEL ALUMNO-----------------------*/
interface representante{
  name : string;
  parentesco : string;
}

/*-----------------------INTERFAZ DEL LUGAR DE ESTUDIO DE LA MATRÍCULA-----------------------*/
interface LugarEstudio{
  nombre : string;
  ubicacion: string ; 
}