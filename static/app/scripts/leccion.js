'use strict'

import $ from 'jquery'

function Leccion (socket){

    let leccion = document.querySelector(".new-leccion")
    let new_preg = document.querySelector("#crear__pregunta")
    let add_leccion = document.querySelector("#add__leccion")
    let completar_new = document.querySelector("#LeccionPregunta-completar-add")
    let simple_new = document.querySelector("#LeccionPregunta-simple-add")
    let add_opc_simple = document.querySelector("#add__respuestas-simples")
    let boton_add_multi = document.querySelector("#LeccionBotonAdd-multiple")
    let add_compuestas_opt = document.querySelector("#add__respuestas-compuestas")
    let enviar_leccion = document.querySelector("#BotonEnviar-leccion")
    let terminar_leccion = document.querySelector("#TerminarLeccionBoton")
    let close_leccion = document.querySelector("#closeLeccion")
    onEvent()

    socket.on("emit::leccion", EmitLeccion)
    socket.on("term::class", onTermClass)

    function onTermClass (data) {
        var type = document.getElementById("type_user").value
        if(type === "Teacher") location.pathname = "/teacher"
        else location.pathname = `/course/${ data.curso }`
    }


    function onEvent(){
      leccion.addEventListener("click", newLeccion, false)
      new_preg.addEventListener("click", newQuestion, false)
      add_leccion.addEventListener("click", selectTypeQuestion, false)
      completar_new.addEventListener("click", completarNew, false)
      simple_new.addEventListener("click", simpleNew, false)
      add_opc_simple.addEventListener("click", opcionSimpleAdd, false)
      boton_add_multi.addEventListener("click", botonAddMultiple, false)
      add_compuestas_opt.addEventListener("click", addCompuetasOpt, false)
      enviar_leccion.addEventListener("click", enviarLeccion, false)
      terminar_leccion.addEventListener("click", TerminarLeccion, false)
      close_leccion.addEventListener("click", closeLeccion, false)
    }

    function closeLeccion () {
        $("#card__leccion").fadeOut()
        $(".container__pregunta-leccion").empty()
        $("#crear__pregunta").attr("disabled", false)
        $(".poppu-message").fadeOut()
    }

  function TemplateLeccion(data) {
    // let data = JSON.parse(data_leccion)
    $("#leccion_id").val(data._id)
    for(let i=0; i<data.num_question; i++){
      let tests = data[`test${i+1}`]
      let type  = ""
      if(tests.type == "C") type = "DE COMPLETAR"
      if(tests.type == "S") type = "DE SELECCION SIMPLE"
      if(tests.type == "M") type = "DE SELECCION MULTIPLE"

      let tpl = `<div>
        <p class="de_completar">${ type }</p>
        <p>
          <span class="count__leccion">${ tests.count }</span>
          <span class="pregunta_leccion_text">${ tests.pregunta }</span>
          <input type="hidden" value="${ tests._id }" />
        </p>
        <div id="resp_preg${tests.count}" class="form-checks"></div>
        <input type="hidden" value="${ tests.type }" />
      </div>`
      document.querySelector(".LeccionPapperBody").innerHTML += tpl;
      let content_resp = document.querySelector(`#resp_preg${tests.count}`)

      if(tests.opciones != null){
        for(let a=0; a<tests.opciones.count_opciones;a++){
          let opciones = tests.opciones[`posibilidad${a+1}`]
          let con_resp = ""
          if(tests.type == "S"){
            con_resp = `<p>
              <input type="radio" value="${ opciones._id }" name="simple${ tests.count }"
                id="simple${a}${ tests.count }" />
              <label for="simple${ a }${ tests.count }">${ opciones.pregunta }</label>
            </p>`
          }
          if(tests.type == "M"){
            con_resp = `<p>
              <input type="checkbox" value="${ opciones._id }" style="float:none" name="multiple${ tests.count }" id="multiple${ a }${ tests.count }"/>
              <label for="multiple${ a }${ tests.count }">${ opciones.pregunta }</label>
            </p>`
          }
          content_resp.innerHTML += con_resp
        }
      }
      else
        content_resp.innerHTML = `<input type="text" class="input__leccion respuesta_leccion" placeholder="Ingres la respuesta"/>`
    }

  }

  function enviarLeccion(){
      var count = document.querySelector(".container__pregunta-leccion").childElementCount
      if(count == 0)
        alert("No tiene preguntas")
      else{
          let data = getData()
          socket.emit("create::leccion", data)
          var lec = document.querySelector(".new-leccion")
          lec.disabled = true
          lec.style = "cursor:no-drop"
          closeLeccion()
      }
  }

  function TerminarLeccion(){
    const questions = document.querySelector(".LeccionPapperBody")
    let estudainte = $("#estudiante_id").val()
    let leccion = $("#leccion_id").val()
    let count_pregu = document.querySelector(".LeccionPapperBody").childElementCount
    let json = { "estudiante":estudainte, "leccion":leccion, "count":count_pregu }

    for(let i=0; i<questions.childElementCount; i++) {
      let pregunta = questions.children[i].children[1].children[2].value
      let type = questions.children[i].children[3].value
      json[`test${i}`] = { "pregunta":pregunta }

      if(type == "C"){
        let respuesta = questions.children[i].children[2].children[0].value
        json[`test${i}`]["respuesta"] = respuesta
      }

      if(type == "S"){
        let name = questions.children[i].children[2].children[0].children[0].name
         let a = document.getElementsByName(name)

         for(let j=0; j<a.length; j++){
           if(a[j].checked == true)
             json[`test${i}`]["respuesta"] = a[j].value
         }

      }
      if(type == "M"){
        let name_m = questions.children[i].children[2].children[0].children[0].name
        let a_m = document.getElementsByName(name_m)
        json[`test${i}`]["respuesta"] = null
        let opcion = []

        for(let e=0; e<a_m.length; e++){
           if(a_m[e].checked == true)
                opcion.push(a_m[e].value)
         }
         json[`test${i}`]["opcion"] = opcion
      }
    }

    console.log( json);
    socket.emit("presentar::leccion", json)
    $(".LeccionPapperBody").empty()
    $(".LeccionPaper").fadeOut()
    alert("La leccion ha sido presentada..")
  }

  function EmitLeccion(data) {
      $(".LeccionPaper").fadeIn()
      alert("La lección  a empezado")
      console.log(data);
      TemplateLeccion(data)
  }

function newLeccion() {
    $("#card__leccion").fadeIn()
  }

function newQuestion() {
    $(".card__preguntas-create").fadeIn()
    $(".type_question-container").fadeIn()
    $(".question__lecccion").val("")
    $(".leccion__completar").fadeOut()
    $(".leccion__simple").fadeOut()
    $(".leccion__compuesta").fadeOut()
  }

function selectTypeQuestion() {
    let select = $(".question__lecccion").val()
    $(".type_question-container").fadeOut()
    if(select == 1)
      $(".leccion__completar").fadeIn()
    if(select == 2)
      $(".leccion__simple").fadeIn()
    if(select == 3)
      $(".leccion__compuesta").fadeIn()
  }

function  completarNew() {
    if($("#pregunta__completar").val() == ""){
        alert("Debes  Ingresar un pregunta.")
    }
    else{
        let pregunta = $("#pregunta__completar")
        let content = $(".container__pregunta-leccion")
        let count = document.querySelector(".container__pregunta-leccion").childElementCount

        let tpl = `<div>
        <p class="de_completar">De completar</p>
        <span class="count__leccion">${ ++count }</span>
        <input data-type="C"  value="${ pregunta.val() }" class="input__leccion" />
        <a class="eliminar__completo">
            <i class="icon-cross"></i>
            <span>Eliminar</span>
        </a>
        </div>`
        content.append(tpl)
        $(".card__preguntas-create").fadeOut()
        pregunta.val("")
        var elim = document.querySelectorAll(".eliminar__completo")

        for(var i=0; i<elim.length; i++){
          elim[i].addEventListener("click", onEliminarCompleto)
        }

    }
  }

function onEliminarCompleto (e) {
    var el = e.path[2]
    el.remove()
    $("#crear__pregunta").attr("disabled", false)
    $(".poppu-message").fadeIn()

    var count = document.querySelectorAll(".count__leccion")
    for(var a=0; a<count.length; a++){
      count[a].innerHTML = a+1
    }

}

function  simpleNew() {
    let pregunta = $("#pregunta__simple")
    if(pregunta.val() == ""){
        alert("Debes Ingresar una pregunta valida.")
    }
    else{
        let content = $(".container__pregunta-leccion")
        let count = document.querySelector(".container__pregunta-leccion").childElementCount
        ++count

        let tpl = `<div>
        <p class="seleccion__simple">De seleccion simple.</p>
        <span class="count__leccion">${ count }</span>
        <input data-type="S" value="${ pregunta.val() }" class="input__leccion" />
        <a class="eliminar__simple">
            <i class="icon-cross"></i>
            <span>Eliminar</span>
        </a>
        <button class="add_option_simple">
            <i class="icon-plus"></i>
            <span class="agregar__simple-span">Agregar</span>
        </button>
        <ul class="lista_opciones" id="lista_opt_simple_${ count }"></ul>
        </div>`
        content.append(tpl)
        let count_opt = document.querySelector(`#lista_opt_simple_${ count }`).childElementCount

        if(count_opt < 3){
            $("#crear__pregunta").attr("disabled", true)
            $(".poppu-message").fadeIn()
        }
        $(".card__preguntas-create").fadeOut()
        pregunta.val("")

        let addopt = $(".add_option_simple")
        addopt.on("click", ()=>$(".grupo__new-simples").fadeIn())
    }
    var elim = document.querySelectorAll(".eliminar__simple")

    for(var i=0; i<elim.length; i++){
      elim[i].addEventListener("click", onEliminarCompleto)
    }
  }

function  opcionSimpleAdd() {
    let option = $("#posibles_respues")
    let count = document.querySelector(".container__pregunta-leccion").childElementCount
    if(option.val() == ""){
        alert("Debes ingresar una opcion.")
    }
    else{
        var tpl = `<li>
        <input  type="radio"  name="simple" />
        <input  type="text" value="${ option.val() }" class="input__leccion" />
        <a class="eliminar__opcion-simple">
            <i class="icon-cross"></i>
            <span>Eliminar</span>
        </a>
        </li>`

        $(`#lista_opt_simple_${ count }`).append(tpl)
        $(".grupo__new-simples").fadeOut()
        option.val("")

        let count_opt = document.querySelector(`#lista_opt_simple_${ count }`).childElementCount
        if(count_opt >= 3){
            $("#crear__pregunta").attr("disabled", false)
            $(".poppu-message").fadeOut()
        }
        var elimsimple = document.querySelectorAll(".eliminar__opcion-simple")

        for(var i=0; i<elimsimple.length; i++)
            elimsimple[i].addEventListener("click", eliminarSimple)
    }
  }

  function eliminarSimple (e) {
      var el = e.path[2]
      el.remove()
  }

function  botonAddMultiple() {
    let pregunta = $("#pregunta__compuesta")

    if(pregunta.val() == ""){
        alert("Debes ingresar una pregunta valida")
    }
    else{
        let content = $(".container__pregunta-leccion")
        let count = document.querySelector(".container__pregunta-leccion").childElementCount
        ++count

        let tpl = `<div>
        <p class="Seleccion__multimple">De Selecion Multiple.</p>
        <span class="count__leccion">${ count }</span>
        <input data-type="M" value="${ pregunta.val() }" class="input__leccion" />
        <a class="eliminar_multiple">
            <i class="icon-cross"></i>
            <span>Eliminar</span>
        </a>
        <button class="add_option_multiple">
            <i class="icon-plus"></i>
            <span class="add_multiple_opt">Agregar</span>
        </button>
        <ul class="lista_opcion_multiple"  id="lista_opt_multiple_${ count }"></ul>
        </div>`
        content.append(tpl)
        let count_opt = document.querySelector(`#lista_opt_multiple_${ count }`).childElementCount

        if(count_opt < 3){
            $("#crear__pregunta").attr("disabled", true)
            $(".poppu-message").fadeIn()
        }
        $(".card__preguntas-create").fadeOut()
        pregunta.val("")

        let addopt = $(".add_option_multiple")
        addopt.on("click", ()=>$(".grupo__new-compuestas").fadeIn())
    }
    var elim = document.querySelectorAll(".eliminar_multiple")

    for(var i=0; i<elim.length; i++){
      elim[i].addEventListener("click", onEliminarMultiple)
    }
  }

function onEliminarMultiple (e) {
    var el = e.path[2]
    el.remove()
    $(".poppu-message").fadeIn()
    $("#crear__pregunta").attr("disabled", false)
    var count = document.querySelectorAll(".count__leccion")

    for(var a=0; a<count.length; a++){
      count[a].innerHTML = a+1
    }
}

function  addCompuetasOpt() {
    let option = $("#posibles__respuesta-compuesta")
    let count = document.querySelector(".container__pregunta-leccion").childElementCount
    // ++count

    if(option.val() == "") {
        alert("Debes ingresar una pregunta.")
    }
    else{
        var tpl = `<li>
        <input  type="checkbox" value="${ option.val() }" name="mutiple"  style="float:none;" />
        <input  type="text" value="${ option.val() }" class="input__leccion" />
        <a class="eliminar_multiple_opcion">
            <i class="icon-cross"></i>
            <span>Eliminar</span>
        </a>
        </li>`

        $(`#lista_opt_multiple_${ count }`).append(tpl)
        $(".grupo__new-compuestas").fadeOut()
        option.val("")

        let count_opt = document.querySelector(`#lista_opt_multiple_${ count }`).childElementCount
        if(count_opt >= 3){
            $("#crear__pregunta").attr("disabled", false)
            $(".poppu-message").fadeOut()
        }
        var elimcompusto =document.querySelectorAll(".eliminar_multiple_opcion")
        for(var i=0; i<elimcompusto.length; i++)
          elimcompusto[i].addEventListener("click", eliminarSimple)
    }

  }


}
function getData() {
  let count = document.querySelector(".container__pregunta-leccion").childElementCount
  let clase = $("#clase_id").val()
  let materia = $("#materia").val()
  let json = { "clase":clase, "materia":materia, "num_question":count }
  let  preguntas = document.querySelector(".container__pregunta-leccion").children

  for(let i=0; i < preguntas.length; i++){
    let count = preguntas[i].children[1].innerHTML
    let test = preguntas[i].children[2].value
    let opt = preguntas[i].children[5]
    let type = preguntas[i].children[2].dataset.type
    let opcion = {}

    if(opt != undefined){
      for(let a=0; a < opt.children.length; a++){
        let list = opt.children[a]
        let posibles = list.children[1].value
        let count = list.childElementCount
        let posib = {}
        opcion["count_opciones"] = count
        opcion[`posibilidad${a+1}`] = { "pregunta":posibles }
      }
    }
    else
      opcion = null

    json[`test${i+1}`] = { "pregunta":test, "count":count, "opciones":opcion, "type" :type}
  }

  return json
}


export default Leccion
