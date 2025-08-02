
import { Tabula} from "./tabula.mjs"; 

var myt;
var mainValues;
var subrows;
function testcallback(id) {
        myt.updateValues(mainValues,subrows);
       console.log("click on "+id);
}

// INIT APP

(function () {


       let opt={
              id:"mytabula",
              width: 14,
              height: 11,
              header: true,
              fixedCol: true,
              groupButtons:true,
              footer: true,
              rowsIds: ["tr-0","tr-1","$S$mySpecial2","tr-2","tr-3","$S$mySpecial1","tr-4","tr-5","tr-6","tr-7","tr-8","tr-9","tr-10"],
              colWidths:["5%","5%","30%","5%","5%","5%","5%","5%","5%","5%","5%","5%","5%","5%"],
              colAligns:["right","","","right","right","right","right","right","right","right","right","right","right","right","right"],
              subrowClickCallback:testcallback,
              };


       // generamos valores para la tabla principal
       mainValues=new Array(opt.height); // el primer elemento (0) es la cabecera
       mainValues[0]=['',"ACCOUNT","NAME","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
       for (let i=1;i<=opt.height;i++) { 
              // el primer elemento del array es la col 0
              mainValues[i]=[i,"","Partida de prueba "+i ,123.32,234.12,345.32,456,567,678,789,876,765,654,543,432];
       }

       subrows=new Array();
       // Creamos valores para los subrows
       for (let r=1;r<=opt.height;r++) { // desde 1 porque el 0 es el header y no tiene subrows
              if (opt.rowsIds[r].substring(0,3)!="$S$") {  // si es una partida especial no asignamos subrows
                     let nsrows=Math.ceil(Math.random()*3)+1; //número de filas aleatorias para probar
                     let auxsrow=[];
                     for (let sr=0;sr<nsrows;sr++) { 
                            // Estructura objeto que define un subrow

                                   auxsrow[sr]={
                                          parentId: opt.rowsIds[r],
                                          subrowId: opt.rowsIds[r]+"-sr-"+sr,
                                          values: ["","Account", "Subpartida de prueba "+sr ,1.1,2.2,3.3,4.4,5.5,6.6,7.7,8.8,9.9,10.10,11.11,12.12]
                                          };
                            
                     }
                     //console.log(auxsrow);
                     subrows[r]=auxsrow;
              }
       }
       //console.log(subrows);


       // creamos y renderizamos tabla
       myt=new Tabula(document.body,opt);
       
       myt.renderMain(mainValues,subrows); // omitir el parametro subrows si no se van a necesitar


       // ejemplo acceso a una celda por su id (IDFILA-n  donde n es el nº de la columna)
       myt.renderCell(document.getElementById("tr-1-3"),Math.floor(Math.random()*40000*100/100),"color:red;");
       // ejemplo acceso a una celda de subfila por su id (ISSUBFILA-cell-n  donde n es el nº de la columna)
       //myt.renderCell(document.getElementById("tr-1-sr-1-cell-4"),Math.floor(Math.random()*40000*100/100),"color:red;");

       // inserta una fila vacía justo antes del elemento indicado con id "tr-9" MYEMPTYROW y clase specialRow-1. 
       // Esa clase estarán definidas por defecto en el css principal
       myt.insertEmptyRow(document.getElementById("tr-5"),"t-gastos","tabula-specialRow-1");
       // inserta una fila vacía al final de la tabla con id MYEMPTYROW y clase specialRow-1. 
       myt.insertEmptyRow("","t-ingresos","tabula-specialRow-1");

       myt.renderCell(document.getElementById("t-gastos-2"),"TOTAL GASTOS","");
       myt.renderCell(document.getElementById("t-ingresos-2"),"TOTAL INGRESOS","");

       // Fila especial creada por el nombre de la partida.
       // los nombres de partidas que comienzan con $S$ son partidas especiales que se renderizan como filas vacías con la clase "tabula-specialRows-1" 
       myt.renderCell(document.getElementById("mySpecial1-2"),"TOTAL CONSUMOS","");

})();
