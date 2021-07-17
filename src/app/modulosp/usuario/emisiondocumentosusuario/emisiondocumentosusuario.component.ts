import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, MenuItem } from 'primeng/primeng';
import swal from 'sweetalert2';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';
import { Tipodocumento } from '../../administrar/tiposdocumentos/tipodocumento';
import { TipodocumentoService } from '../../administrar/tiposdocumentos/tipodocumento.service';
import { Emisiondocumento, Estado } from '../../administrar/emiciondocumentos/emisiondocumento';
import { EmisiondocumentoService } from '../../administrar/emiciondocumentos/emisiondocumento.service';
@Component({
  selector: 'app-emisiondocumentosusuario',
  templateUrl: './emisiondocumentosusuario.component.html'
})
export class EmisiondocumentosusuarioComponent implements OnInit {

  private emisiondocumento: Emisiondocumento = new Emisiondocumento();
  private persona: Persona = new Persona();

  estado: Estado[] = [
    { id: 1, name: 'Solicitar', code: 'Pendiente' }
  ];

  tipodocumento: Tipodocumento[];
  displayModalcomprobante: boolean;

  showBasicDialogcomprobante() {
    this.displayModalcomprobante = true;
  }
  constructor(
    private emisiondocumentoService: EmisiondocumentoService,
    private activatedRoute: ActivatedRoute,
    private personaService: PersonaService,
    private tipodocumentoService: TipodocumentoService,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.tipodocumentoService.getTiposDocumentos().subscribe(
      tipodocumento => this.tipodocumento = tipodocumento
    );
  }
//******** CREACION DE SOLICITUD DE DOCUMENTOS, VALIDA DATOS VACIOS */
  public create(): void {
    if (
      this.emisiondocumento.emidDescripcion == null ||
      this.emisiondocumento.emidFkTipodocumento == null ||
      this.emisiondocumento.emidReferencias == null ||
      this.persona == null
    ) {
      swal.fire(
        'Error al Guardar',
        'Revise los datos de entrada',
        'error'
      )
    } else {
      this.emisiondocumento.emidFkPersona = (this.persona);
      this.emisiondocumento.emidEstado = "Pendiente";
      this.emisiondocumentoService.create(this.emisiondocumento).subscribe(
        Response => {
          swal.fire({
            title: 'Solicitud creada',
            text: `Solicitud del documento ${this.emisiondocumento.emidFkTipodocumento.tipdNombre} creada, desea generar comprobante`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Generar!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.showBasicDialogcomprobante();
            }
          })
        }
      )
      this.emisiondocumento.emidDescripcion = null;
      this.emisiondocumento.emidReferencias = null;
    }


  }
//******** VALIDACION DE CEDULA CORRECTA  */
  public OptenerCedula(): void {
    var persCedula = ((document.getElementById("emi_cedula") as HTMLInputElement).value);
    console.log(persCedula);
    if (persCedula) {
      this.validadorDeCedula(persCedula);
      if (this.validador == true) {
        this.personaService.getPersona2(persCedula).subscribe(
          data => this.persona = data)
        console.log(this.persona)
      } else {
        swal.fire(
          'Error de ingreso',
          'Debe Ingresar un cedula valida',
          'error'
        );
      }

    } else {
      swal.fire(
        'Error de ingreso',
        'Debe Ingresar un numero cedula',
        'error'
      );
    }
  }
//******** COMPARA SERVICIOS ES DECIR CEDULAS REMETIDAS */
  CompararServicio(o1: Tipodocumento, o2: Tipodocumento): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }



  //esta es la variable de validación
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
}
