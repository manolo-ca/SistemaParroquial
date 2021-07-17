
import { Persona } from "src/app/modulosp/registropersona/persona";
import { Alumno } from "../AdministrarAulmno/AdministrarAlumnoservicio";

export class Representante {
    padrId:number;
    padrParentesco: string;
    padrRepresentante: Boolean ;
    padrFkAlumno: Alumno;
    padrFkPersona: Persona;
}