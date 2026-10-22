// Esta función se invoca exclusivamente desde el servidor y las pruebas.
export function level(p:number,i:number) {
 if(!Number.isInteger(p)||!Number.isInteger(i)||p<1||p>3||i<1||i>3)throw new RangeError('Probabilidad e impacto deben estar entre 1 y 3');
 const score=p*i;
 return {score,label:(score<=2?'Bajo':score<=4?'Medio':'Alto') as 'Bajo'|'Medio'|'Alto'};
}
