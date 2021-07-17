import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { PersonaService } from './persona.service';
import { Persona } from './persona';
import swal from 'sweetalert2'
@Component({
  selector: 'app-registropersona',
  templateUrl: './registropersona.component.html'
})
export class RegistropersonaComponent implements OnInit {

  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  files: TreeNode[];
  addForm2: FormGroup;
  dis: boolean;
  persona: Persona[];
  private persona2: Persona = new Persona();
  addForm: FormGroup;
  date: Date;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private personaService: PersonaService,
    private nodeService: NodeService
  ) { }

  ngOnInit() {

    this.nodeService.getFilesystem().then(files => this.files = files);
    this.addForm2 = this.formBuilder.group({
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
    this.listar();
  }


  //********* LISTA LOS REGISTROS ACTAULES  */
  private listar() {
    this.personaService.getPersonas().subscribe(
      persona => this.persona = persona)
  }
//******* ELIMINA EL REGISTRO DE LA PERSONA */
  delete(persona: Persona): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! Eliminar`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.delete(persona.persid).subscribe(
          response => {
            this.persona = this.persona.filter(person => person !== persona)
            swalWithBootstrapButtons.fire(
              'Eliminado',
              'Su registro fue eliminado satisfactoriamente',

            )
          }
        )
      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Su registro no se elimino :)',
          'error'
        )
      }
    })
  }

  //******* VARIABLE DE VALIDACION */
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

  public validadorNumericos;
//******* VALIDACION DE CAMPOS  */
  public validarNumericos(telefono: String, cedula: String) {
    let numericos = false;
    var valoresAceptados = /^[0-9]+$/;
    if (telefono.match(valoresAceptados) && cedula.match(valoresAceptados)) {
      numericos = true;
    } else {
      swal.fire(
        'Error de Campos',
        'Revise que los datos de cedula o telefono sean numericos',
        'error'
      )
      numericos = false;
    }
    return this.validadorNumericos = numericos;
  }

  public validadorFecha;

  public validarFecha(fechaNacimiento2: Date, fechaBautizmo2: Date) {
    let fecha = false;
    var hoy = new Date();
    var fechaNacimiento =  new Date(fechaNacimiento2);
    var fechaBautizmo = new Date(fechaBautizmo2);
    // Comparamos solo las fechas => no las horas!!
    hoy.setHours(0, 0, 0, 0);
    fechaNacimiento.setHours(24, 0, 0, 0); // Lo iniciamos a 00:00 horas
    fechaBautizmo.setHours(24, 0, 0, 0); // Lo iniciamos a 00:00 horas
    if (fechaBautizmo2 != null) {
      if (hoy >= fechaNacimiento && hoy >= fechaBautizmo) {
        this.persona2.persfechanacimiento=fechaNacimiento
        this.persona2.persfechabautismo=fechaBautizmo
        fecha = true;
      }
      else {
        swal.fire(
          'Error de Fecha',
          'Revise la Fecha de nacimiento o bautizo ingresada, no debe ser mayor a la actual',
          'error'
        )
        fecha = false
      }
    } else {
      if (hoy >= fechaNacimiento) {
        this.persona2.persfechanacimiento=fechaNacimiento
        fecha = true;
      }
      else {
        swal.fire(
          'Error de Fecha',
          'Revise la Fecha de nacimiento ingresada, no debe ser mayor a la actual',
          'error'
        )
        fecha = false
      }

    }
    return this.validadorFecha = fecha;
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
  public create(): void {
    var cedula2 = this.persona2.persCedula;
    var telefono = this.persona2.persTelefono;
    var fechaNacimiento = this.persona2.persfechanacimiento;
    var fechaBautizo = this.persona2.persfechabautismo;
    var email = this.persona2.persEmail;
    if (
      this.persona2.persCedula != null &&
      this.persona2.persNombre != null &&
      this.persona2.persApellido != null &&
      this.persona2.persTelefono != null &&
      this.persona2.persDireccion != null &&
      this.persona2.persfechanacimiento != null) {
      this.validarNumericos(telefono, cedula2);
      this.validarFecha(fechaNacimiento, fechaBautizo);
      this.validarCorreo(email);
      if (this.validadorNumericos == true && this.validadorFecha == true && this.validadorCorreo == true) {
        this.validadorDeCedula(cedula2);
        if (this.validador == true) {
          this.personaService.create(this.persona2).subscribe(
            Response => {
              swal.fire(
                'Usuario Guardado',
                `Usuario ${this.persona2.persNombre} creado con exito!`,
                'success'
              )
              this.listar();
              this.cancelar()
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
//******* CARGA UNA LISTA GENERADA DE PERSONAS */
  cargarPersona(persona: Persona): void {
    localStorage.setItem("persid", persona.persid.toString());
    let persid = localStorage.getItem('persid');
    this.personaService.getPersona(+persid).subscribe((data) =>
      this.persona2 = data);
  }
//******* MODIFICA LOS DATOS DE PERSONA */
  public update(): void {
    var cedula2 = this.persona2.persCedula;
    var telefono = this.persona2.persTelefono;
    var fechaNacimiento = this.persona2.persfechanacimiento;
    var fechaBautizo = this.persona2.persfechabautismo;
    var email = this.persona2.persEmail;
    if (
      this.persona2.persCedula != null &&
      this.persona2.persNombre != null &&
      this.persona2.persApellido != null &&
      this.persona2.persTelefono != null &&
      this.persona2.persDireccion != null) {
      this.validarNumericos(telefono, cedula2)
      this.validarFecha(fechaNacimiento, fechaBautizo);
      this.validarCorreo(email);
      if (this.validadorNumericos == true && this.validadorFecha == true && this.validadorCorreo == true) {
        this.validadorDeCedula(cedula2);
        if (this.validador == true) {
          this.personaService.update(this.persona2)
            .subscribe(cliente => {
              swal.fire(
                'Usuario Actualizado',
                `Usuario ${this.persona2.persNombre} Actualizado con exito!`,
                'success'
              )
              this.listar();
              this.cancelar()
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
        'Revise los datos ingresados',
        'error'
      )
    }
  }

  public cancelar(): void {
    this.persona2.persid = null;
    this.persona2.persCedula = null;
    this.persona2.persNombre = null;
    this.persona2.persApellido = null;
    this.persona2.persEmail = null;
    this.persona2.persTelefono = null;
    this.persona2.persDireccion = null;
    this.persona2.persfechanacimiento = null;
    this.persona2.persfechabautismo = null;
  }

}
