// ════════════════════════════════════════════════════
//   EDICIONES MUNDO — clientes.js
//   CRUD Django + Mini Encuesta (no se guarda en BD)
// ════════════════════════════════════════════════════
console.log("🔥 clientes.js CARGADO");

const API_DEPARTAMENTOS = "http://127.0.0.1:8000/catalogo/departamentos/";
const API_CLIENTES      = "http://127.0.0.1:8000/catalogo/clientes/";

// ── Respuestas de la encuesta (solo en memoria, nunca a la BD) ──
const encuestaRespuestas = {
  precios:       null,
  experiencia:   null,
  compra:        null,
  financiamiento: null,
  sugerencia:    ""
};

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("clienteForm");
  if (!form) return;

  // ── Elementos del form ──
  const selectDepartamento = document.getElementById("departamento");
  const clienteId          = document.getElementById("clienteId");
  const codigo             = document.getElementById("codigo");
  const nombre             = document.getElementById("nombre");
  const apellido           = document.getElementById("apellido");
  const edad               = document.getElementById("edad");
  const genero             = document.getElementById("genero");

  // ── Pasos ──
  const panelEncuesta  = document.getElementById("panelEncuesta");
  const panelDatos     = document.getElementById("panelDatos");
  const btnContinuar   = document.getElementById("btnContinuar");
  const btnVolver      = document.getElementById("btnVolver");
  const stepBubble1    = document.getElementById("stepBubble1");
  const stepBubble2    = document.getElementById("stepBubble2");
  const stepLabel1     = document.getElementById("stepLabel1");
  const stepLabel2     = document.getElementById("stepLabel2");
  const stepLine       = document.getElementById("stepLineFill");
  const step1          = document.getElementById("step1");
  const step2          = document.getElementById("step2");

  // ════════════════════════
  // ENCUESTA — chips
  // ════════════════════════
  document.querySelectorAll(".encuesta__chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const group = chip.dataset.group;
      // Deseleccionar los demás del mismo grupo
      document.querySelectorAll(`.encuesta__chip[data-group="${group}"]`)
        .forEach(c => c.classList.remove("selected"));
      chip.classList.add("selected");
      encuestaRespuestas[group] = chip.dataset.value;
    });
  });

  // Textarea sugerencia
  const txtSugerencia = document.getElementById("encuestaSugerencia");
  if (txtSugerencia) {
    txtSugerencia.addEventListener("input", () => {
      encuestaRespuestas.sugerencia = txtSugerencia.value;
    });
  }

  // ── Botón continuar ──
  if (btnContinuar) {
    btnContinuar.addEventListener("click", () => {
      // Validar que respondió al menos precios y experiencia
      if (!encuestaRespuestas.precios || !encuestaRespuestas.experiencia) {
        showToast("⚠️ Por favor responde las preguntas 1 y 2 para continuar", "error");
        return;
      }
      irAlPaso(2);
    });
  }

  // ── Botón volver ──
  if (btnVolver) {
    btnVolver.addEventListener("click", () => irAlPaso(1));
  }

  function irAlPaso(paso) {
    if (paso === 1) {
      panelEncuesta.classList.add("active");
      panelDatos.classList.remove("active");
      step1.classList.add("active");
      step2.classList.remove("active", "done");
      if (stepLine) stepLine.classList.remove("filled");
    } else {
      panelEncuesta.classList.remove("active");
      panelDatos.classList.add("active");
      step1.classList.remove("active");
      step1.classList.add("done");
      step2.classList.add("active");
      if (stepLine) stepLine.classList.add("filled");
    }
  }

  // ════════════════════════
  // DEPARTAMENTOS
  // ════════════════════════
  function cargarDepartamentos() {
    fetch(API_DEPARTAMENTOS)
      .then(res => res.json())
      .then(data => {
        console.log("📦 Departamentos:", data);
        selectDepartamento.innerHTML = `<option value="">Seleccione un departamento</option>`;
        data.forEach(dep => {
          const opt = document.createElement("option");
          opt.value = dep.id;
          opt.textContent = dep.nombre;
          selectDepartamento.appendChild(opt);
        });
      })
      .catch(err => {
        console.error("❌ Departamentos:", err);
        // Fallback con departamentos de Nicaragua
        const depsFallback = [
          "Boaco","Carazo","Chinandega","Chontales","Estelí","Granada",
          "Jinotega","León","Madriz","Managua","Masaya","Matagalpa",
          "Nueva Segovia","Río San Juan","Rivas","RAAN","RAAS"
        ];
        selectDepartamento.innerHTML = `<option value="">Seleccione un departamento</option>`;
        depsFallback.forEach((dep, i) => {
          const opt = document.createElement("option");
          opt.value = i + 1;
          opt.textContent = dep;
          selectDepartamento.appendChild(opt);
        });
      });
  }

  // ════════════════════════
  // GUARDAR CLIENTE
  // ════════════════════════
  form.addEventListener("submit", e => {
    e.preventDefault();

    const id = clienteId.value;

    // Solo estos datos van a la BD — la encuesta NO se incluye
    const cliente = {
      codigo:        codigo.value.trim(),
      nombre:        nombre.value.trim(),
      apellido:      apellido.value.trim(),
      edad:          Number(edad.value),
      departamento:  selectDepartamento.value,
      genero:        genero.value
    };

    // Validación básica
    if (!cliente.codigo || !cliente.nombre || !cliente.apellido ||
        !cliente.edad   || !cliente.departamento || !cliente.genero) {
      showToast("⚠️ Por favor completa todos los campos", "error");
      return;
    }

    const method = id ? "PUT" : "POST";
    const url    = id ? `${API_CLIENTES}${id}/` : API_CLIENTES;

    // Log de encuesta en consola (para debug, nunca va a la BD)
    console.log("📋 Respuestas encuesta (no guardadas):", encuestaRespuestas);

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        form.reset();
        clienteId.value = "";
        // Limpiar chips seleccionados
        document.querySelectorAll(".encuesta__chip").forEach(c => c.classList.remove("selected"));
        if (txtSugerencia) txtSugerencia.value = "";
        Object.keys(encuestaRespuestas).forEach(k => encuestaRespuestas[k] = null);
        encuestaRespuestas.sugerencia = "";
        // Volver al paso 1
        irAlPaso(1);
        showToast("✅ Cliente registrado correctamente", "success");
      })
      .catch(err => {
        console.error("❌ Guardar cliente:", err);
        showToast("❌ Error al guardar. Revisa la conexión.", "error");
      });
  });

  // ════════════════════════
  // TOAST
  // ════════════════════════
  function showToast(msg, tipo = "success") {
    let toast = document.getElementById("clienteToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "clienteToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `toast toast--${tipo}`;
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  // ── Init ──
  cargarDepartamentos();
  irAlPaso(1);
});