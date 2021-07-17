import { Persona } from "../modulosp/registropersona/persona";

export class Usuario {
    
    usuaId: number;
    usuaFkPersona: Persona;
    usuaUsuario: string; 
    usuaContraseña: string;
    
}