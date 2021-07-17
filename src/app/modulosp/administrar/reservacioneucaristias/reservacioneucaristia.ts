
import { Persona } from "../../registropersona/persona";
import { Calendario } from "../../usuario/calendario";
import { TipoEucaristia } from "../tipoeucaristias/tipoeucaristia";

export class ReservacionEucaristia{
    reseId : number;
    reseOtros : string;
    reseDescripcion : string;
    reseValorfijo : number;
    reseFechareservacion : Date;
    reseEstado : Boolean;
    
    reseFkCalendario: Calendario;
    reseFkPersona:Persona;
    reseFkTiposeucaristias: TipoEucaristia; 
}
