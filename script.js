const criterios = [
  ["Calidad del contenido","Exactitud, claridad, actualidad y pertinencia del contenido."],
  ["Alineación con los objetivos","Contribución al logro de los resultados de aprendizaje."],
  ["Retroalimentación y adaptación","Retroalimentación significativa y adaptación al usuario."],
  ["Motivación","Capta y mantiene el interés."],
  ["Diseño de presentación","Organización visual y estética."],
  ["Usabilidad","Facilidad de navegación."],
  ["Accesibilidad","Adecuación para diversas condiciones."],
  ["Reusabilidad","Uso en distintos contextos."],
  ["Cumplimiento de estándares","Calidad técnica y pedagógica."],
  ["Organización de la información","Claridad y orden lógico."],
  ["Expresión oral o simbólica","Lenguaje adecuado."],
  ["Nitidez","Claridad audiovisual."]
];

window.onload = function() {
  const tabla = document.getElementById("tablaEvaluacion");
  criterios.forEach(([nombre, desc], i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${nombre}</td><td>${desc}</td>
    <td><select id="c${i}"><option>1</option><option>2</option>
    <option selected>3</option><option>4</option><option>5</option></select></td>`;
    tabla.appendChild(fila);
  });

  cargarDatos();
};

function calcular(){
  let total = 0;
  criterios.forEach((_, i)=> total += parseInt(document.getElementById(`c${i}`).value));

  let cal = (total*100/60).toFixed(2);
  let concepto = cal<40?"CALIDAD INSUFICIENTE": cal<60?"CALIDAD BAJA": cal<80?"CALIDAD ACEPTABLE": cal<90?"CALIDAD ALTA":"CALIDAD MUY ALTA";

  document.getElementById("puntaje").textContent = total;
  document.getElementById("calificacion").textContent = cal;
  document.getElementById("concepto").textContent = concepto;

  document.getElementById("resultado").style.display="block";
  guardarDatos();
}

function guardarDatos(){
  const datos = {
    nombre: nombre.value,
    area: area.value,
    objetivo: objetivo.value,
    url: url.value,
    descripcion: descripcion.value,
    observaciones: observaciones.value
  };
  localStorage.setItem("evaluacionRED", JSON.stringify(datos));
}

function cargarDatos(){
  const d = JSON.parse(localStorage.getItem("evaluacionRED"));
  if(!d) return;
  nombre.value=d.nombre;
  area.value=d.area;
  objetivo.value=d.objetivo;
  url.value=d.url;
  descripcion.value=d.descripcion;
  observaciones.value=d.observaciones;
}

async function generarPDF(){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(18);
  pdf.text("Evaluación RED - Informe Profesional", 10, 20);

  pdf.addImage(await fetch('logo.svg').then(r=>r.text()), "SVG", 150, 10, 40, 40);

  pdf.setFontSize(12);
  pdf.text(`Nombre del recurso: ${nombre.value}`, 10, 60);
  pdf.text(`Área: ${area.value}`, 10, 70);
  pdf.text(`Objetivo: ${objetivo.value}`, 10, 80);
  pdf.text(`URL: ${url.value}`, 10, 90);

  pdf.text("TABLA DE CRITERIOS", 10, 110);

  criterios.forEach(([c,_],i)=>{
    pdf.text(`${c}: ${document.getElementById('c'+i).value}`, 10, 120 + i*6);
  });

  pdf.text("Observaciones:", 10, 200);
  pdf.text(observaciones.value, 10, 210);

  pdf.text("Firma del evaluador: ____________________", 10, 260);

  pdf.save("Informe_RED.pdf");
}
