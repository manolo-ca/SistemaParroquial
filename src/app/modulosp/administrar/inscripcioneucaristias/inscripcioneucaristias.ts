
import { Persona } from "../../registropersona/persona";
import { Calendario } from "../../usuario/calendario";
import { TipoEucaristia } from "../tipoeucaristias/tipoeucaristia";

export class InscripcionEucaristias {
    inseId: number;
    inseOtros:string;
    inseDescripcionnombre:string;
    inseFecharegistro:Date;
    inseValorvoluntario:number;
    inseEstado:Boolean;
    inseFkCalendario: Calendario;
    inseFkPersona: Persona;
    inseFkTiposeucaristias: TipoEucaristia;
}
