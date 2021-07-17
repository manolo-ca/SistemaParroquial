import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {SelectItem} from 'primeng/primeng';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { InscripcionEucaristias } from '../../administrar/inscripcioneucaristias/inscripcioneucaristias';
import { InscripcioneucaristiaService } from '../../administrar/inscripcioneucaristias/inscripcioneucaristias.service';


import { TipoEucaristia } from '../../administrar/tipoeucaristias/tipoeucaristia';
import { TipoEucaristiaService } from '../../administrar/tipoeucaristias/tipoeucaristia.service';

import swal from 'sweetalert2';
import { Calendario } from '../calendario';
import { CalendarioService } from '../calendario.service';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';


@Component({
  selector: 'app-inscripcioneucaristiasusuario',
  templateUrl: './inscripcioneucaristiasusuario.component.html'
})
export class InscripcioneucaristiasusuarioComponent implements OnInit {
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
  dateFiltro : Date = new Date();
  dateRegistro: Date = new Date();
  dateReserva: Date = new Date();
  date8: Date;

  dateActual :Date = new Date();
  cedula:string;
  nombre:string;
  dis:boolean;
  ieservacion: InscripcionEucaristias[]=[];
  iEucaristia: InscripcionEucaristias = new InscripcionEucaristias() ;
  cedulacorrecta : boolean =false;
  
  fullcalendarOptions: any;
  inscripciones: any[];
  tipo = {};

  tiposEucaristias : TipoEucaristia[];
  tipoEucaristiaSelect: TipoEucaristia = new TipoEucaristia();

  Estado : EstadoInterf[];
  estadoSelect: EstadoInterf;

  Personas= new Array<Persona>();
  Persona: Persona = new Persona(); ;

  PersonasLista : Persona[];

  eventos = new Array<Calendario>();
  eventosActuales =  new Array<Calendario>();
  eventoselect : Calendario = new Calendario();
  banEventos:boolean;  


  checked1 :boolean =false;

  nombreTE : string = "";



  constructor(private router: Router, private formBuilder: FormBuilder, private inseEucaService : InscripcioneucaristiaService,private TipoEucaristiaServicio:TipoEucaristiaService, private PersonaServicio:PersonaService, private CalendarioServicio: CalendarioService ) { 
    
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

    this.TipoEucaristiaServicio.listarTipoEucaristiaPublico().subscribe(data => {
      this.tiposEucaristias = data;
    });

    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;

    });

    
    this.Estado = [
      {name: 'Activo', estado:true},
      {name: 'Inactivo', estado:false}
    ];

    this.listarEventosActuales();
  }

  get f() { return this.addForm.controls; }

  handleChange(e) {
    this.checked1 = e.checked;
  
  }
//******** LISTA LAS EUCARISTIAS AGENDADAS */
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
//********** ESTO PARA PODER GENERAR UNA INSCRIPCION DEBE ESTAR LOS DATOS LLENADOS CORRECTAMETE */
  onSubmit() {
    try{
      this.iEucaristia = new InscripcionEucaristias();
      this.submitted=true;
      if (this.addForm.invalid) {
        this.recuperarInformacion();
        console.log(this.iEucaristia);
        swal.fire(
          'Inscripción Erronea',
          `Existen campos incorrectos`,
          "error")
        return;
      }else{
        this.recuperarInformacion();
        console.log(this.iEucaristia);
        this.nombreTE = this.iEucaristia.inseFkTiposeucaristias.tipeNombre;
        this.inseEucaService.createIEucaristia(this.iEucaristia)
        .subscribe(data => {
          swal.fire(
            'Inscripción Exitosa',
            `Inscripción de Eucaristía registrada`,
            "success")
          
          this.addForm.reset();
          this.eventoselect = new Calendario();
          this.date1 = new Date();
          this.dis=true;
          
          });
      }
    }catch(e){

    }
    
  }
///*********** REFRESCA LA PAGINA CON NUEVOS DATOS */
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('Inicio', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }
//********* RECUPERA LA INFORMACION Y GENERA LOS VALORES FIJOS DE UNA RESERVA */
  recuperarInformacion(){
    this.Persona =  this.buscarCedula(this.addForm.get('reseCedula').value);
    var valorFijo: number = this.addForm.get('reseValorfijo').value;
    
    this.dateRegistro = new Date();
    this.dateReserva = new Date(this.eventoselect.caleFecha.toString());
    this.tipoEucaristiaSelect = this.reseTiposeucaristias.value;
    
    this.iEucaristia.inseOtros = this.addForm.get('reseOtros').value;
    this.iEucaristia.inseDescripcionnombre = this.addForm.get('reseDescripcion').value + "  Hora eucaristía: "+this.eventoselect.caleHora;
    this.iEucaristia.inseValorvoluntario=valorFijo;    
    this.iEucaristia.inseFecharegistro=this.date1;   
    this.iEucaristia.inseEstado=false;
    this.iEucaristia.inseFkCalendario= this.eventoselect;   
    this.iEucaristia.inseFkPersona=this.Persona;   
    this.iEucaristia.inseFkTiposeucaristias=this.tipoEucaristiaSelect;
    
  }
//********* BUSCA POR SU ID ES DECIR SU CEDULA */
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
    
  }
//****** VERIFICA LA CEDULA EN ELE SISTEMA DE NO CONSTRA PUEDE REGISTRAR */
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
          if(result.value){
            this.router.navigate(['/resgistro-personas']);
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
//********** VALIDACION DE LA CEDULA */ */
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




