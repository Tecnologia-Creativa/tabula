
import { Tabula} from "./tabula.mjs"; 


function testcallback(id) {
       console.log("click on "+id);
}

// INIT APP

(function () {


       let opt={
              id:"mytabula",
              width: 14,
              height: 7,
              header: true,
              fixedCol: true,
              footer: true,
              rowsIds: ["tr-0","tr-1","tr-2","tr-3","tr-4","tr-5","tr-6","tr-7"],
              colWidths:["5%","5%","30%","5%","5%","5%","5%","5%","5%","5%","5%","5%","5%","5%"],
              colAligns:["right","","","right","right","right","right","right","right","right","right","right","right","right","right"],
              subrowClickCallback:testcallback,
              };


       // generamos valores para la tabla principal
       let mainValues=new Array(opt.height); // el primer elemento (0) es la cabecera
       mainValues[0]=['',"ACCOUNT","NAME","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
       for (let i=1;i<=opt.height;i++) { 
              // el primer elemento del array es la col 0
              mainValues[i]=[i,"","Partida de prueba "+i ,123.32,234.12,345.32,456,567,678,789,876,765,654,543,432];
       }

       let subrows=new Array();
       // Creamos valores para los subrows
       for (let r=1;r<=opt.height;r++) { // desde 1 porque el 0 es el header y no tiene subrows
              let nsrows=Math.ceil(Math.random()*14)+1; //número de filas aleatorias para probar
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
       //console.log(subrows);


       // creamos y renderizamos tabla
       var myt=new Tabula(document.body,opt);
       myt.renderMain(mainValues,subrows);


       // ejemplo acceso a una celda por su id
       myt.renderCell(document.getElementById("tr-1-3"),Math.floor(Math.random()*40000*100/100),"color:red;");
       myt.renderCell(document.getElementById("tr-1-sr-1-cell-4"),Math.floor(Math.random()*40000*100/100),"color:red;");

})();
