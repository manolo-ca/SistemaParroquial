import { Nivel } from "../administrar-Niveles/Nivelservicio";
import { Periodo } from "../administrar-Periodos/Periodoservicio";
import { tipoInscripcion } from "../administrar-tipo-inscripcion/tipoInscripcion";
import { Alumno } from "../AdministrarAulmno/AdministrarAlumnoservicio";

export class matriculaAlumno {
    matrId:number;
    matrEstado: Boolean;
    matrEstadonivelapro : Boolean;
    
    matrFkAlumno: Alumno;
    matrFkNivel: Nivel;
    matrFkPeriodo: Periodo;
    matrFkTipoinscrpcion: tipoInscripcion;
    
    matrLugar:string;
    matrValor: number;
}