console.log("[Coursera Grade Calculator] Coursera extension loaded");

(function calculateGrade() {
    const waitForContent = setInterval(() => {
        const table = document.querySelector('div[role="grid"][aria-label="Assignments Table"]');
        if (table) {
            const allRows = Array.from(table.querySelectorAll('div[role="row"]'));

            // Filter only rows with both weight and grade columns (i.e., valid assignment rows)
            const validRows = allRows.filter(row =>
                row.querySelector('.weight-column') && row.querySelector('.grade-column')
            );

            console.log(`[Coursera Grade Calculator] Found ${validRows.length} valid assignment rows`);
            if (validRows.length > 0) {
                clearInterval(waitForContent);
                computeGradeFromRows(validRows);
            }
        }
    }, 500);

    function parsePercent(text) {
        if (!text || text.trim() === "--") return null;
        const match = text.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : null;
    }

    function computeGradeFromRows(rows) {
        let totalWeightAll = 0;
        let weightedSumAll = 0;

        let totalWeightGraded = 0;
        let weightedSumGraded = 0;

        rows.forEach((row, i) => {
            const weightEl = row.querySelector('.weight-column');
            const gradeEl = row.querySelector('.grade-column');

            const weightText = weightEl?.innerText;
            const gradeText = gradeEl?.innerText;

            const weight = parsePercent(weightText);
            const grade = parsePercent(gradeText);

            if (weight != null) {
                totalWeightAll += weight;

                if (grade != null) {
                    totalWeightGraded += weight;
                    weightedSumGraded += (grade * weight / 100);
                    weightedSumAll += (grade * weight / 100);
                    console.log(`[Coursera Grade Calculator] Row ${i + 1} — Weight: ${weight}%, Grade: ${grade}%`);
                } else {
                    weightedSumAll += 0;
                    console.log(`[Coursera Grade Calculator] Row ${i + 1} — Weight: ${weight}%, Grade: -- (ungraded)`);
                }
            }
        });

        const gradedScore = totalWeightGraded > 0 ? (weightedSumGraded / totalWeightGraded) * 100 : null;
        const projectedScore = totalWeightAll > 0 ? (weightedSumAll / totalWeightAll) * 100 : null;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #f0f8ff;
            border: 2px solid #333;
            padding: 16px;
            font-size: 16px;
            color: #000;
            margin: 20px;
            width: fit-content;
        `;

        box.innerHTML = `
            <div style="display: flex; justify-content: space-between; gap: 40px; min-width: 300px; margin-bottom: 6px;">
                <span><strong>Graded Only:</strong></span>
                <span style="text-align: right;">${gradedScore !== null ? gradedScore.toFixed(2) + '%' : 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 40px; min-width: 300px;">
                <span><strong>Including Ungraded as 0%:</strong></span>
                <span style="text-align: right;">${projectedScore !== null ? projectedScore.toFixed(2) + '%' : 'N/A'}</span>
            </div>
        `;

        const container = document.querySelector('[data-testid="assignments-page"]') || document.body;
        container.prepend(box);

        console.log(`[Coursera Grade Calculator] Final graded-only: ${gradedScore?.toFixed(2)}%`);
        console.log(`[Coursera Grade Calculator] Final including ungraded: ${projectedScore?.toFixed(2)}%`);
    }
})();
