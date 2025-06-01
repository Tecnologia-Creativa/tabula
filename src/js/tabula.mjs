export { Tabula };

// ******************************************
//            Tabula class
// ******************************************
//
// document.getElementById(id).attribute;
// document.getElementById(id).innerHTML; -> devuelve todo el html
// document.getElementById(id).innerText; -> devuelte el texto eliminando espacios innecesarios
// document.getElementById("id").textContent; --> devuelve el texto completo con los espacios extra sin etiquetas html
// node.setAttribute("attrb","value");

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
              subrowClickCallback:()=>{}, // revuelve el id del subrow pulsado
       }
       #startCol = 1;
       #startRow = 1;

       theGrid=[];   // array con los objetos de los valores.
                     // 

       tableObj = {};

       //// *************************************** INTERNALS

       constructor(htmlObject, params=[]) {
              this.#container = htmlObject;

              this.#processOptions(params);
              this.#createGrid();
              this.#createTableBase();
       }

       #createGrid() {
              // definimos el objeto fila, compuesto por array de valores y array de subfilas
              let rowobject={values:[],subrows:[]}; 
              // Inicializamos el array de valores con el establecido en opciones 
              rowobject.values=new Array(this.#options.width).fill("",0,this.#options.width); 
              // inicializamos el objeto y lo rellenamos con la cantidad de filas establecido
              this.theGrid=new Array(this.#options.height);
              this.theGrid.fill(rowobject,0,this.#options.width);
              //this.theGrid.fill({})
       }

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
                     if (rows == 0) {
                            auxRow = this.#createItem("thead", "", "", this.tableObj);
                            auxRow = this.#createItem("tr", rowid, "", auxRow);
                     } else {
                            if (rows == 1) {
                                   auxtbody = this.#createItem("tbody", "", "", this.tableObj);
                            }
                            auxRow = this.#createItem("tr", rowid, "", auxtbody);
                     }
                     for (let cols = this.#startCol; cols <= this.#options.width; cols++) {
                            var colid=this.#options.rowsIds[rows] + "-" + cols;
                            if (rows == 0) {
                                   auxCol = this.#createItem("th", colid, "", auxRow);
                                   auxCol.setAttribute("scope", "col");
                            } else {
                                   if (cols == 0) {
                                          auxCol = this.#createItem("th", colid, "", auxRow);
                                          auxCol.setAttribute("scope", "row");
                                          let auxcmd=this.#createItem("button","cmd_"+this.#options.rowsIds[rows],"tabula-groupButton",auxCol);
                                          auxcmd.appendChild(this.#createTextNode("+"));
                                          auxcmd.addEventListener("click", this.#toggleGroupState);

                                   } else {
                                          auxCol = this.#createItem("td", colid,"", auxRow);
                                   }
                            }
                            auxCol.appendChild(this.#createTextNode(""));
                            auxCol.style.textAlign=this.#options.colAligns[cols];
                     }
              }

       }

       #createItem(element, theid = "", theclass = "", parentNode) {
              const uiaux = document.createElement(element);
              this.#setItemAttribute(uiaux, "id", theid);
              this.#setItemAttribute(uiaux, "class", theclass);
              return parentNode.appendChild(uiaux);
       }

       #setItemAttribute(theItem, theAttrib, theValue = "") {
              let attraux = document.createAttribute(theAttrib);
              attraux.value = theValue;
              theItem.setAttributeNode(attraux);
       }

       #createTextNode(text) {
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
              subrows.forEach((row => row.style.display=displayType )
              );
       }

       #addSubRow (parentId,id,values=[]) {
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
                     let auxCol=this.#createItem("td",parentId + "-"+id,"",auxRow);
                     auxCol.appendChild(this.#createTextNode(values[i]));
                     auxCol.style.textAlign=this.#options.colAligns[i];
              }
              //console.log(auxRow);
              theparent.insertAdjacentElement("afterEnd",auxRow);
       }

       #renderCell(mynode,cellValue='',style="") {
              mynode.style=style;
              if(isNaN(cellValue) || (cellValue.length<1)) {
                     mynode.innerText=String(cellValue).trim();   
              } else {
                     mynode.innerText=new Intl.NumberFormat("es-ES",{ minimumFractionDigits: 2}, {maximumFractionDigits: 2}).format(cellValue)
              }
              
       }
       
       //// *************************************** PUBLICS

       renderMain(valuesRows=[],valuesSubrows=[]) {
              // filas
              for (let r=0;r<valuesRows.length;r++) { 
                     let rowchilds=document.getElementById(this.#options.rowsIds[r]).childNodes;
                     for (let c=1;c<valuesRows[r].length;c++) { // columnas
                            this.#renderCell(rowchilds[c],valuesRows[r][c]);                      // METER ESTILO Y HACE PÚBLICO
                     }
                     // subrows
                     if (r>0) { // no tocamos cabecera
                            for (let sr=valuesSubrows[r].length-1;sr>=0;sr--) { 
                                   //console.log(valuesSubrows[r][sr]);
                                   this.#addSubRow (valuesSubrows[r][sr].parentId,valuesSubrows[r][sr].subrowId,valuesSubrows[r][sr].values);
                            }
                      }

              }
       }


       setMainValues(tcol = 0, trow = 0, tvalue = "", tstyle = "") {
              this.tableValues;
       }

       

       reset() {
              this.#createTableBase();
       }



}




