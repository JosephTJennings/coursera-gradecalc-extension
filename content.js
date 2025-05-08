console.log("[Coursera Grade Calculator] Script loaded");

let gradeBoxElement = null;
let ungradedInputs = {};
let gradedOnlySpan = null;
let projectedSpan = null;

function parsePercent(text) {
  if (!text || text.trim() === "--") return null;
  const match = text.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function extractValidRows() {
  const allRows = Array.from(document.querySelectorAll('div[role="row"]'));
  return allRows.filter(row => {
    const isGroupHeader = row.className.includes('AssignmentsGroupHeader');
    const hasWeight = row.querySelector('.weight-column span');
    const hasGrade = row.querySelector('.grade-column span');
    return !isGroupHeader && (hasWeight || hasGrade);
  });
}

function calculateScores(rows, manualOverrides = {}) {
  let totalWeightAll = 0;
  let weightedSumAll = 0;

  let totalWeightGraded = 0;
  let weightedSumGraded = 0;

  const missingGrades = [];

  rows.forEach((row, i) => {
    const weightEl = row.querySelector('.weight-column span');
    const gradeEl = row.querySelector('.grade-column span');
    const title = row.querySelector('[data-e2e="item-title-text"]')?.innerText?.trim() || `Assignment ${i + 1}`;

    const weightText = weightEl?.innerText;
    const gradeText = gradeEl?.innerText;

    const weight = parsePercent(weightText);
    let grade = parsePercent(gradeText);

    if (manualOverrides[i] != null) {
      grade = manualOverrides[i];
    }

    if (weight != null) {
      totalWeightAll += weight;

      if (grade != null) {
        totalWeightGraded += weight;
        weightedSumGraded += (grade * weight / 100);
        weightedSumAll += (grade * weight / 100);
      } else {
        weightedSumAll += 0;
        missingGrades.push({ title, index: i, weight });
      }
    }
  });

  const gradedScore = totalWeightGraded > 0 ? (weightedSumGraded / totalWeightGraded) * 100 : null;
  const projectedScore = totalWeightAll > 0 ? (weightedSumAll / totalWeightAll) * 100 : null;

  return { gradedScore, projectedScore, missingGrades };
}

function updateScoreDisplay(gradedScore, projectedScore) {
  if (gradedOnlySpan) gradedOnlySpan.textContent = gradedScore !== null ? gradedScore.toFixed(2) + '%' : 'N/A';
  if (projectedSpan) projectedSpan.textContent = projectedScore !== null ? projectedScore.toFixed(2) + '%' : 'N/A';
}

function renderGradeBox(rows) {
  const { gradedScore, projectedScore, missingGrades } = calculateScores(rows, ungradedInputs);

  if (gradeBoxElement) {
    gradeBoxElement.remove();
  }

  gradeBoxElement = document.createElement("div");
  gradeBoxElement = document.createElement("div");
  gradeBoxElement.style.cssText = `
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 16px;
    font-size: 16px;
    color: #333;
    margin: 20px auto;
    width: fit-content;
    position: relative;
    max-width: 500px;
    font-family: Arial, sans-serif;
  `;
  
  gradeBoxElement.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <button id="gradecalc-refresh-btn" title="Refresh" style="background: none; border: none; font-size: 20px; cursor: pointer;">🔄</button>
      <button id="gradecalc-edit-btn" title="Edit Missing Grades" style="background: none; border: none; font-size: 20px; cursor: pointer;">📋</button>
    </div>
    <div style="display: flex; justify-content: space-between; gap: 40px; min-width: 300px; margin-bottom: 6px;">
      <span><strong>Graded Only:</strong></span>
      <span id="gradecalc-graded"></span>
    </div>
    <div style="display: flex; justify-content: space-between; gap: 40px; min-width: 300px;">
      <span><strong>Including Ungraded as 0%:</strong></span>
      <span id="gradecalc-projected"></span>
    </div>
    <div id="gradecalc-editor" style="display:none; max-height: 200px; overflow-y: auto; margin-top: 12px; border-top: 1px solid #ccc; padding-top: 10px;"></div>
  `;

  gradedOnlySpan = gradeBoxElement.querySelector('#gradecalc-graded');
  projectedSpan = gradeBoxElement.querySelector('#gradecalc-projected');
  updateScoreDisplay(gradedScore, projectedScore);

  const editor = gradeBoxElement.querySelector('#gradecalc-editor');
  missingGrades.forEach(({ title, index, weight }) => {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '8px';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.step = '0.1';
    input.value = ungradedInputs[index] ?? '';
    input.placeholder = `${title} (${weight}%)`;
    input.style.width = '100%';
    
    // Prevent scroll wheel from changing input value
    input.addEventListener('wheel', function (e) {
        if (document.activeElement === this) {
          e.preventDefault();
        }
      });
    
    input.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        ungradedInputs[index] = value;
      } else {
        delete ungradedInputs[index];
      }
      const scores = calculateScores(rows, ungradedInputs);
      updateScoreDisplay(scores.gradedScore, scores.projectedScore);
    });

    wrapper.appendChild(input);
    editor.appendChild(wrapper);
  });

  const container = document.querySelector('[data-testid="assignments-page"]') || document.body;
  container.prepend(gradeBoxElement);

  gradeBoxElement.querySelector('#gradecalc-refresh-btn').addEventListener('click', () => {
    console.log("[GradeCalc] Manual refresh triggered");
    const rows = extractValidRows();
    renderGradeBox(rows);
  });

  gradeBoxElement.querySelector('#gradecalc-edit-btn').addEventListener('click', () => {
    const editorDiv = document.getElementById("gradecalc-editor");
    editorDiv.style.display = editorDiv.style.display === "none" ? "block" : "none";
  });
}

function tryRenderGrades() {
  const table = document.querySelector('div[role="grid"][aria-label="Assignments Table"]');
  if (!table || gradeBoxElement) return;
  const rows = extractValidRows();
  if (rows.length > 0) renderGradeBox(rows);
}

function observeForGradesPage() {
    const observer = new MutationObserver(() => {
      const isOnAssignmentsPage = window.location.pathname.includes('/home/assignments');
      if (isOnAssignmentsPage) {
        tryRenderGrades();
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Try to render immediately in case we're already on the correct page
    tryRenderGrades();
  }
  
  // Start observing when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeForGradesPage);
  } else {
    observeForGradesPage();
  }