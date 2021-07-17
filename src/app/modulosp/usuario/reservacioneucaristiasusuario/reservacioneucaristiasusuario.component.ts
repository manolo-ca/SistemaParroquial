import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SelectItem} from 'primeng/primeng';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReservacionEucaristiaService } from '../../administrar/reservacioneucaristias/reservacioneucaristia.service';
import { ReservacionEucaristia } from '../../administrar/reservacioneucaristias/reservacioneucaristia';
import { TipoEucaristia } from '../../administrar/tipoeucaristias/tipoeucaristia';
import { TipoEucaristiaService } from '../../administrar/tipoeucaristias/tipoeucaristia.service';

import swal from 'sweetalert2';
import { Calendario } from '../calendario';
import { CalendarioService } from '../calendario.service';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';


@Component({
  selector: 'app-reservacioneucaristiasusuario',
  templateUrl: './reservacioneucaristiasusuario.component.html'
})

export class ReservacioneucaristiasusuarioComponent implements OnInit {
  addForm: FormGroup =new FormGroup({
    reseOtros: new FormControl ('',[Validators.required]),
    reseDescripcion: new FormControl ('',[Validators.required]),
    reseValorfijo: new FormControl ('',[Validators.required]),
    reseFechareservacion: new FormControl ('',[Validators.required]),
    reseEstado: new FormControl (''),
    reseCalendario: new FormControl ('',[Validators.required]),
    reseTiposeucaristias: new FormControl ('',[Validators.required]),
    reseHora: new FormControl ('',[Validators.required]),
    resePersona: new FormControl ('',[Validators.required]),
    reseCedula: new FormControl ('',[Validators.required])

  });
  submitted = false;
  date1: Date = new Date();
  date2: Date = new Date();
  date8: Date;
  cedula:string;
  nombre:string;
  reservacion: ReservacionEucaristia[]=[];
  rEucaristia: ReservacionEucaristia = new ReservacionEucaristia();
  cedulacorrecta : boolean =false;
  
  fullcalendarOptions: any;
  inscripciones: any[];
  tipo = {};

  tiposEucaristias : TipoEucaristia[];
  tipoEucaristiaSelect: TipoEucaristia = new TipoEucaristia();

  Estado : EstadoInterf[];
  estadoSelect: EstadoInterf;

  Personas= new Array<Persona>();
  Persona: Persona = new Persona();

  PersonasLista : Persona[];

  eventos = new Array<Calendario>();
  eventosActuales =  new Array<Calendario>();
  eventoselect : Calendario = new Calendario();
  banEventos:boolean; 
  dateActual :Date = new Date();
  dateFiltro :Date = new Date();

  checked1 :boolean =false;
  dis:boolean;

  dateRegistro: Date = new Date();
  dateReserva: Date = new Date();
  nombreTE : string = "";

  constructor(private router: Router, private formBuilder: FormBuilder, private resEucaService : ReservacionEucaristiaService,private TipoEucaristiaServicio:TipoEucaristiaService, private PersonaServicio:PersonaService, private CalendarioServicio: CalendarioService ) { 
  }
  
  ngOnInit() {
    
    this.fullcalendarOptions = {
      plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
      defaultDate: '2016-01-12',
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    };

    this.TipoEucaristiaServicio.listarTipoEucaristiaPrivado().subscribe(data => {
      this.tiposEucaristias = data;
    });

    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;

    });

    
    this.Estado = [
      {name: 'Activo', estado:true},
      {name: 'Inactivo', estado:false}
    ];

    this.eventoselect = new Calendario();
    this.listarEventosActuales();
  }

  get f() { return this.addForm.controls; }

  handleChange(e) {
    this.checked1 = e.checked;
  
  }

  //******* LISTA LA RESERVAS GENERADAS */
  listarEventosActuales(){
    this.banEventos=false;
    this.CalendarioServicio.listarEventos().subscribe(data =>{
      this.eventos = data;
      console.log("Filtro: "+this.dateFiltro.getTime())

      for (let index = 0; index < this.eventos.length; index++) {

        this.dateActual = new Date(this.eventos[index].caleFecha)

        if ((this.dateActual.getTime() > this.dateFiltro.getTime()) || (this.dateFiltro.getTime() == this.dateActual.getTime())) {
          console.log("Evento Agregado: "+this.dateActual.getTime())
          this.eventosActuales.push(this.eventos[index]);
          this.banEventos =true;
        }

      }
      
    });
  }
//***** PUEDE GENERAR UNA RESERVA Y LLENAR LOS DATOS CORRECTAMENTE */
  onSubmit() {
    try{
      this.rEucaristia = new ReservacionEucaristia();
      this.submitted=true;
      if (this.addForm.invalid) {
        this.recuperarInformacion();
        console.log(this.rEucaristia);
        swal.fire(
          'Reservación Erronea',
          `Existen campos incorrectos`,
          "error")
        return;
      }else{
        this.recuperarInformacion();
        this.nombreTE = this.rEucaristia.reseFkTiposeucaristias.tipeNombre;
        console.log(this.rEucaristia);
        this.resEucaService.crearReservacion(this.rEucaristia)
        .subscribe(data => {
          swal.fire(
            'Reservación Exitosa',
            `Reservación de Eucaristía registrada`,
            "success")
         
          this.eventoselect = new Calendario();
          this.date1 = new Date();
          this.dis=true;
        });
      }
    }catch(e){

    }
    
  }
//*** RECUPERA LA INFORMACION Y GENERA VALORES FIJOS */
  recuperarInformacion(){
    var Otros:string = this.addForm.get('reseOtros').value;
    var Descripcion:string = this.addForm.get('reseDescripcion').value;
    var valorFijo: number = this.addForm.get('reseValorfijo').value;
  
    var fechaReservacion:Date = new Date(""+ this.addForm.get('reseFechareservacion').value);

    this.dateRegistro = new Date();
    this.dateReserva = new Date(this.eventoselect.caleFecha.toString());
    this.Persona =  this.buscarCedula(this.addForm.get('reseCedula').value);
    this.tipoEucaristiaSelect = this.reseTiposeucaristias.value;

    this.rEucaristia.reseOtros = Otros;
    this.rEucaristia.reseDescripcion = Descripcion + "  Hora eucaristía: "+this.eventoselect.caleHora;
    this.rEucaristia.reseValorfijo=valorFijo;    
    this.rEucaristia.reseFechareservacion=this.addForm.get('reseFechareservacion').value;   
    this.rEucaristia.reseEstado=false;   
    this.rEucaristia.reseFkCalendario= this.eventoselect;   
    this.rEucaristia.reseFkPersona=this.Persona;   
    this.rEucaristia.reseFkTiposeucaristias=this.tipoEucaristiaSelect;
    
  }
  crearFormulario(){
    return 
  }

  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
    
  }
//******** BUSCA LA CEDULA EN EL SISTEMA DE NO ESTAR PUEDE REGISTRARSE */
  findbyCedula() {
    this.validarCedula(this.addForm.get('reseCedula').value);
    if(this.cedulacorrecta=true){
      this.cedulacorrecta=false;
      console.log(this.addForm.get('reseCedula').value);
      if (this.PersonasLista.includes(this.buscarCedula(this.addForm.get('reseCedula').value))){
        this.resePersona.setValue(this.buscarCedula(this.addForm.get('reseCedula').value).persNombre +  "  " + this.buscarCedula(this.addForm.get('reseCedula').value).persApellido);
      }else{
        swal.fire({
          title:'Usuario no existe',
          text: `Desea registrar al usuario ${this.addForm.get('reseCedula').value} ?`,
          showDenyButton: true,
          confirmButtonText: `Aceptar`,
          denyButtonText: `Cancelar`,
        }).then((result)=>{
          if(result.isConfirmed){
            this.router.navigate(['/resgistro-personas']);
          }else if(result.isConfirmed){

          }
        })
      }
    }
  }

  get reseOtros(){return this.addForm.get('reseOtros');}
  get reseDescripcion(){return this.addForm.get('reseDescripcion');}
  get reseValorfijo(){return this.addForm.get('reseValorfijo');}
  get reseFechareservacion(){return this.addForm.get('reseFechareservacion');}
  get reseEstado(){return this.addForm.get('reseEstado');}
  get reseCalendario(){return this.addForm.get('reseCalendario');}
  get resePersona(){return this.addForm.get('resePersona');}
  get reseTiposeucaristias(){return this.addForm.get('reseTiposeucaristias');}
  get reseHora(){return this.addForm.get('reseHora');}
  get reseCedula(){return this.addForm.get('reseCedula');}
//********* VALIDA LA CEDULA */
  validarCedula(cedula: string) {
    if (cedula.length === 10) {
      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = cedula.substring(0, 2);
      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= String(1) && digitoRegion <= String(24)) {
        // Extraigo el ultimo digito
        const ultimoDigito = Number(cedula.substring(9, 10));
        // Agrupo todos los pares y los sumo
        const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));
        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = cedula.substring(0, 1);
        numeroUno = (numeroUno * 2);
        if (numeroUno > 9) {
          numeroUno = (numeroUno - 9);
        }
        let numeroTres: any = cedula.substring(2, 3);
        numeroTres = (numeroTres * 2);
        if (numeroTres > 9) {
          numeroTres = (numeroTres - 9);
        }
  
        let numeroCinco: any = cedula.substring(4, 5);
        numeroCinco = (numeroCinco * 2);
        if (numeroCinco > 9) {
          numeroCinco = (numeroCinco - 9);
        }
  
        let numeroSiete: any = cedula.substring(6, 7);
        numeroSiete = (numeroSiete * 2);
        if (numeroSiete > 9) {
          numeroSiete = (numeroSiete - 9);
        }
  
        let numeroNueve: any = cedula.substring(8, 9);
        numeroNueve = (numeroNueve * 2);
        if (numeroNueve > 9) {
          numeroNueve = (numeroNueve - 9);
        }
  
        const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;
  
        // Suma total
        const sumaTotal = (pares + impares);
  
        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);
  
        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;
  
        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;
  
        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }
  
        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          return this.cedulacorrecta = true;
        } else {
          return this.cedulacorrecta = false;
        }
  
      } else {
        // imprimimos en consola si la region no pertenece
        return this.cedulacorrecta = false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      return this.cedulacorrecta = false;
    }
  
  }
}
interface EstadoInterf {
  name: string;
  estado: boolean;
}