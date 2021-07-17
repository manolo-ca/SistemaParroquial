import {Tipodocumento} from '../tiposdocumentos/tipodocumento';
import { Persona } from '../../registropersona/persona';
export class Documento {
    docuId: number;
    docuLibronombre: string;
    docuReferencia: string;
    docuLugarNacimiento: string;
    docu_fecha_matrimonio: Date;
    docuLugarMatrimonio: string;
    docuContrayenteEsposo: string;
    docuContrayenteEsposa: string;
    docuTestigoUno: string;
    docuTestigoDos: string;
    docuPadrino: string;
    docuMadrina: string;
    docuTomo: string;
    docuFolio:number;
    docuPagina: number;
    docuActa: number;
    docuSacerdote: string;
    docuCeduTestigouno: string;
    docuCeduTestigodos: string;
    docuFkPersona: Persona;
    docuFkTipodocumento: Tipodocumento
}

export class Documentodos { 
id: number;
tipdNombre:string;   
}     
        
    