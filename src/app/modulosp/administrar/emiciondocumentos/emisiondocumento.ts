import { Tipodocumento } from '../tiposdocumentos/tipodocumento';
import { Persona } from '../../registropersona/persona';
export class Emisiondocumento{
    emidId: number;
    emidReferencias: string;
    emidDescripcion: string;
    emidFechasolicitud: Date;
    emidEstado: string;
    emidFkPersona: Persona;
    emidFkTipodocumento: Tipodocumento;
  
  }
  
  export class Estado {
    id: number;
    name: string;
    code: string;
  
  }

  export class FechaBusqueda {
    
    fechaInicio: Date;
    fechaFin: Date;
    idDocumentos:number
  
  }
