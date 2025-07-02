document.addEventListener('DOMContentLoaded', () => {
  const selectHoras = document.getElementById('select-horas');
  const inputsContainer = document.getElementById('inputs-container');
  const btnCalcular = document.getElementById('btn-calcular');
  const mediaFinalEl = document.getElementById('media-final');
  const situacaoEl = document.getElementById('situacao');
  const resultBox = document.getElementById('result-box');

  let isFourthActive = false;
  let initialMedia = 0;

  adjustInputs();
  selectHoras.addEventListener('change', () => {
    isFourthActive = false;
    adjustInputs();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCalculate();
    }
    if (e.key === 'Shift') {
      e.preventDefault();
      focusNextInput();
    }
  });

  btnCalcular.addEventListener('click', () => handleCalculate());

  function handleCalculate() {
    const active = document.activeElement;
    // verifica se focus está no input da quarta prova
    if (isFourthActive && active && active.id === 'fourth-grade') {
      calcularQuarta();
    } else {
      calcularMedia();
    }
  }

  function adjustInputs() {
    inputsContainer.innerHTML = '';
    clearFourthInput();
    isFourthActive = false;
    const horas = selectHoras.value;
    const count = horas === '30' ? 2 : 3;
    for (let i = 0; i < count; i++) {
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.step = '0.1';
      inp.placeholder = `Nota ${i + 1}`;
      inputsContainer.appendChild(inp);
    }
    inputsContainer.querySelector('input').focus();
  }

  function focusNextInput() {
    const inputs = Array.from(document.querySelectorAll('input'));
    const idx = inputs.findIndex(i => i === document.activeElement);
    const next = (idx < 0 || idx === inputs.length - 1) ? 0 : idx + 1;
    inputs[next].focus();
  }

  function calcularMedia() {
    clearFourthInput();
    const notas = Array.from(inputsContainer.querySelectorAll('input'))
                       .map(i => parseFloat(i.value) || 0);
    if (notas.length === 2) {
      initialMedia = (notas[0] + notas[1]) / 2;
    } else {
      initialMedia = (notas[0] * 4 + notas[1] * 5 + notas[2] * 6) / 15;
    }
    mediaFinalEl.textContent = initialMedia.toFixed(2);

    if (initialMedia >= 7) {
      situacaoEl.textContent = 'Passou com sucesso';
      isFourthActive = false;
    } else {
      situacaoEl.textContent = 'Reprovado';
      addFourthInput();
    }
  }

  function addFourthInput() {
    isFourthActive = true;
    const div = document.createElement('div');
    div.id = 'fourth-container';
    div.innerHTML = `
      <p>Precisa tirar na 4ª prova: <span id="required-grade"></span></p>
      <input type="number" step="0.1" id="fourth-grade" placeholder="Nota 4ª prova" />
      <button id="btn-calc-fourth">Calcular 4ª</button>
    `;
    resultBox.appendChild(div);

    const needed = (6 * 2) - initialMedia;
    document.getElementById('required-grade').textContent = needed.toFixed(2);

    const btn4 = document.getElementById('btn-calc-fourth');
    btn4.addEventListener('click', calcularQuarta);
  }

  function calcularQuarta() {
    const val4 = parseFloat(document.getElementById('fourth-grade').value) || 0;
    const finalMedia = (initialMedia + val4) / 2;
    mediaFinalEl.textContent = finalMedia.toFixed(2);
    situacaoEl.textContent = finalMedia >= 6 ? 'Passou com sucesso' : 'Reprovado';
  }

  function clearFourthInput() {
    const old = document.getElementById('fourth-container');
    if (old) old.remove();
  }
});