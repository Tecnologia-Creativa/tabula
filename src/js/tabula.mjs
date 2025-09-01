export { Tabula };

// ******************************************
//            Tabula class
// ******************************************
//
// Version 0.1       

class Tabula {

       version = "1.0";
       #container = {};
       #options = {
              id: "tabula-1",
              width: 14,
              height: 10,
              header: true,
              fixedCol: true,
              groupButtons: true,
              footer: true,
              rowsIds: [], // id del nodo
              rowsValues:[], // values
              colWidths:[], // style units
              colAligns:[],// text-align directive
              mainrowClickCallback: null,
              subrowClickCallback: () => {} // revuelve el id del subrow pulsado
       }
       #startCol = 1;
       #startRow = 1;

       theGrid=[];   // array con los objetos de los valores.
                     // De momento no lo usamos !!!!!

       tableObj = {};

       //// *************************************** INTERNALS

       constructor(htmlObject, params=[]) {
              this.#container = htmlObject;

              this.#processOptions(params);
              // this.#createGrid();
              this.#createTableBase();
       }

       // #createGrid() { // DE MOMENTO NO USAMOS EL GRID
       //        // definimos el objeto fila, compuesto por array de valores y array de subfilas
       //        let rowobject={values:[],subrows:[]}; 
       //        // Inicializamos el array de valores con el establecido en opciones 
       //        rowobject.values=new Array(this.#options.width).fill("",0,this.#options.width); 
       //        // inicializamos el objeto y lo rellenamos con la cantidad de filas establecido
       //        this.theGrid=new Array(this.#options.height);
       //        this.theGrid.fill(rowobject,0,this.#options.width);
       //        //this.theGrid.fill({})
       // }

       #processOptions(myparams) {
              Object.assign(this.#options, myparams || {});
              
              for (let i=0;i<=this.#options.height;i++) {
                     (String(this.#options.rowsIds[i])==="") ? this.#options.rowsIds[i]="r"+i : this.#options.rowsIds[i]=this.#options.rowsIds[i].trim() ;
              }
              for (let c=0;c<=this.#options.width;c++) {
                     try {
                            if ((this.#options.colWidths[c]).length>0) { this.#options.colWidths[c]=this.#options.colWidths[c].trim(); }
                     } catch (e) {
                            this.#options.colWidths[c]="";
                     }
              }
       }

       #createTableBase() {
              let auxRow = {};
              let auxCol = {};
              this.#options.header ? this.#startRow = 0 : this.#startRow = 1;
              this.#options.fixedCol ? this.#startCol = 0 : this.#startCol = 1;
              let auxtbody = {};
              let auxcolgroup={};
              let isSpecial=false;

              if (document.getElementById(this.#options.id)) document.getElementById(this.#options.id).remove();
       
              this.tableObj= null;
              this.tableObj = this.#createItem("table", this.#options.id, "tabula-table", this.#container);

              auxcolgroup=this.#createItem("colgroup", "", "", this.tableObj)
              
              for (let i=this.#startCol;i<=this.#options.width; i++){
                     let auxcol=this.#createItem("col", rowid, "", auxcolgroup);
                     auxcol.style.width=this.#options.colWidths[i];
              }

              for (let rows = this.#startRow; rows <= this.#options.height; rows++) {
                     var rowid=this.#options.rowsIds[rows];
                     if (rowid.substring(0,3)=="$S$") { 
                            isSpecial=true;
                            rowid=rowid.substring(3);
                      } else {
                            isSpecial=false;
                      };
                     if (rows == 0) {
                            auxRow = this.#createItem("thead", "", "", this.tableObj);
                            auxRow = this.#createItem("tr", rowid, "", auxRow);
                     } else {
                            if (rows == 1) {
                                   auxtbody = this.#createItem("tbody", "tabula-tbody", "", this.tableObj);
                            }
                            auxRow = this.#createItem("tr", rowid, (isSpecial ? "tabula-specialRow-1":""), auxtbody);
                     }
                     
                     for (let cols = this.#startCol; cols <= this.#options.width; cols++) {
                            var colid=rowid + "-" + cols; //this.#options.rowsIds[rows]
                            if (rows == 0) {
                                   auxCol = this.#createItem("th", colid, "", auxRow);
                                   auxCol.setAttribute("scope", "col");
                            } else {
                                   if ((cols == 0) && !isSpecial) {
                                          auxCol = this.#createItem("th", colid, "", auxRow);
                                          auxCol.setAttribute("scope", "row");
                                          if (this.#options.groupButtons) {
                                                 let auxcmd=this.#createItem("button","cmd_"+rowid,"tabula-groupButton",auxCol);
                                                 auxcmd.appendChild(this.#createTextNode("+"));
                                                 auxcmd.addEventListener("click", this.#toggleGroupState);
                                          }

                                   } else {
                                          auxCol = this.#createItem("td", colid,"", auxRow);
                                   }
                            }
                            auxCol.appendChild(this.#createTextNode(""));
                            auxCol.style.textAlign=this.#options.colAligns[cols];
                     }
              }

       }

       #createItem(element, theid = "", theclass = "", parentNode) { // crea un elemento y lo anexa a nodo padre
              const uiaux = document.createElement(element);
              this.#setItemAttribute(uiaux, "id", theid);
              this.#setItemAttribute(uiaux, "class", theclass);
              return parentNode.appendChild(uiaux);
       }

       #createItem2(element, theid = "", theclass = "", nodeReference="") { // crea un elemento y lo anexa a un nodo según la posición elegida
              let insertionPoint="beforebegin";            //<!-- beforebegin --><p> <!-- afterbegin --> XXXXXXX <!-- beforeend --> </p> <!-- afterend --> 
                                                                     
              const uiaux = document.createElement(element);
              this.#setItemAttribute(uiaux, "id", theid);
              this.#setItemAttribute(uiaux, "class", theclass);
              if (nodeReference=="") { 
                     nodeReference=document.getElementById("tabula-tbody"); 
                     insertionPoint="beforeend";
              };
              return nodeReference.insertAdjacentElement(insertionPoint,uiaux);
       }

       #setItemAttribute(theItem, theAttrib, theValue = "") {
              let attraux = document.createAttribute(theAttrib);
              attraux.value = theValue;
              theItem.setAttributeNode(attraux);
       }

       #createTextNode(text="") {
              let auxnode = document.createTextNode(text);
              return auxnode;
       }

/*        #sanitize(myarray,nelements) {
              for (let i=0; i<=nelements;i++) {
                     if (myarray[i]===undefined) {myarray[i]="";}
              }
       }
 */
       #toggleGroupState(e) {
              let displayType="";
              
              if (e.currentTarget.innerText==="+") {
                     e.currentTarget.innerText="-";
                     displayType="";
              } else {
                     e.currentTarget.innerText="+";
                      displayType="none";
              }

              let row=e.currentTarget.parentNode.parentNode;
              const subrows=document.querySelectorAll("[parentid="+row.id+"]");
              subrows.forEach(( row => row.style.display=displayType ));
       }

       #addSubRow (parentId,id,values=[]) {
              //console.log(parentId+" --> "+id);
              let theparent=document.getElementById(parentId);
              //this.#sanitize(values,this.#options.width);
              const auxRow = document.createElement("tr");
              this.#setItemAttribute(auxRow, "id", id);
              this.#setItemAttribute(auxRow, "class", "tabula-subRow");
              this.#setItemAttribute(auxRow, "parentId", parentId);
              this.#setItemAttribute(auxRow, "style","display:none;");
              
              auxRow.addEventListener("click",(e)=> {
                     document.querySelectorAll(".tabula-selected-subrow").forEach(
                                                 (x)=> { x.classList.remove("tabula-selected-subrow");}
                                          );
                     if (!auxRow.classList.contains("tabula-selected-subrow")) {
                            auxRow.classList.add("tabula-selected-subrow");
                     }
                     this.#options.subrowClickCallback(e.currentTarget.id);
              });

              for ( let i=this.#startCol;i<=this.#options.width;i++) {
                     let auxCol=this.#createItem("td",id + "-cell-"+i,"",auxRow);
                     //let auxNode=this.#createTextNode(auxCol);
                     //auxCol.appendChild(auxNode);
                     this.renderCell(auxCol,values[i],"");
                     auxCol.style.textAlign=this.#options.colAligns[i];
              }
              //console.log(auxRow);
              theparent.insertAdjacentElement("afterEnd",auxRow);
       }



       
              //// *************************************** PUBLICS


       renderCell(mynode,cellValue='',style=null) {
              if(style != null){
                     mynode.style=style;
              }

              if(cellValue == null){
                     mynode.innerText = '';
              } else {
                     if(isNaN(cellValue) || (cellValue.length<1)) {
                            mynode.innerText=String(cellValue).trim();   
                     } else {
                            var _v = parseFloat(cellValue).toFixed(2);
                            if(_v == 0){
                                   mynode.innerText = '--';
                            } else {
                                   mynode.innerText = new Intl.NumberFormat("es-ES",{useGrouping: "always", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(_v);
                            }
                     }
              } 
       }
       
       renderMain(valuesRows=[],valuesSubrows=[]) {
              // filas
              for (let r=0;r<valuesRows.length;r++) { 
                     if(document.getElementById(this.#options.rowsIds[r])){

                            let mainrow = document.getElementById(this.#options.rowsIds[r]);
                            let rowchilds=document.getElementById(this.#options.rowsIds[r]).childNodes;
                            
                            for (let c=1;c<valuesRows[r].length;c++) { // columnas
                                   this.renderCell(rowchilds[c], valuesRows[r][c]);                      // METER ESTILO Y HACER PÚBLICO
                            }

                            // Función para poder colocar un evento de click en las rows principales
                            if(this.#options.mainrowClickCallback != null){
                                   mainrow.addEventListener("click", (e) => {
                                          // Dejamos esto comentado, para que no ponga estilos en la row seleccionada, pero si aplique el click
                                          // En caso que queramos que se aplique el estilo, basta con descomentar esta linea
                                          /*
                                          document.querySelectorAll(".tabula-selected-row").forEach(
                                                 (x)=> { x.classList.remove("tabula-selected-row");}
                                          );

                                          if (!mainrow.classList.contains("tabula-selected-row")) {
                                                 mainrow.classList.add("tabula-selected-row");
                                          }
                                          */
                                          this.#options.mainrowClickCallback(e.currentTarget.id);
                                   });
                            }
                     }

                     // subrows
                     if ((r>0) && (valuesSubrows.length>0) && valuesSubrows[r] ) { // no tocamos cabecera
                            //console.log(valuesSubrows[r].length);
                            for (let sr=valuesSubrows[r].length-1;sr>=0;sr--) { 
                                   //console.log(valuesSubrows[r][sr]);
                                   if (document.getElementById(valuesSubrows[r][sr].subrowId)) document.getElementById(valuesSubrows[r][sr].subrowId).remove();
                                   this.#addSubRow (valuesSubrows[r][sr].parentId,valuesSubrows[r][sr].subrowId,valuesSubrows[r][sr].values);
                            }
                      }

              }
       }

       updateValues(valuesRows=[],valuesSubrows=[]) {
              // filas
              for (let r=0;r<valuesRows.length;r++) { 
                     if(document.getElementById(this.#options.rowsIds[r])){
                            let rowchilds=document.getElementById(this.#options.rowsIds[r]).childNodes;
                            for (let c=1;c<valuesRows[r].length;c++) { // columnas
                                   this.renderCell(rowchilds[c],valuesRows[r][c]);                      // METER ESTILO Y HACER PÚBLICO
                            }
                     }

                     // subrows
                     if (r>0) { // no tocamos cabecera
                            for (let sr=valuesSubrows[r].length-1;sr>=0;sr--) { 
                                   //console.log(valuesSubrows[r][sr].subrowId+"   "+valuesSubrows[r][sr].values);
                                   for ( let i=this.#startCol;i<=this.#options.width;i++) {
                                                 let auxobj=document.getElementById(valuesSubrows[r][sr].subrowId+"-cell-"+i);
                                                 this.renderCell(auxobj,valuesSubrows[r][sr].values[i],"");
                                                 auxobj.style.textAlign=this.#options.colAligns[i];
                                          } 
                            }
                      }

              }
       }

       insertEmptyRow(afterNode="",id="",theclass="") {
              let auxRow={};
              let auxCol = {};
              auxRow = this.#createItem2("tr", id, theclass, afterNode);
              for (let cols = this.#startCol; cols <= this.#options.width; cols++) {
                     auxCol = this.#createItem("td", id+"-"+cols,"", auxRow);
                     auxCol.appendChild(this.#createTextNode(""));
                     auxCol.style.textAlign=this.#options.colAligns[cols];
              }
       }

       reset() {
              this.#createTableBase();
       }



}




