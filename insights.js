// Function to generate the last 15 dates
function generateLast15Dates() {
  const labels = [];
  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(
      `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    );
  }
  return labels;
}

Chart.register({
  id: "crosshairPlugin",
  afterDraw: function (chart) {
    if (chart.crosshair && chart.crosshair.x !== undefined) {
      const { x, y, y2 } = chart.crosshair;
      const ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  },
});

const labels = generateLast15Dates();

var ctx = document.getElementById("insightChart").getContext("2d");
var insightChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Transactions Captured",
        data: Array.from({ length: 15 }, () =>
          Math.floor(Math.random() * 2000)
        ),
        borderColor: "#337CE5",
        backgroundColor: "transparent",
        fill: false,
      },
      {
        label: "Transactions Reported",
        data: Array.from({ length: 15 }, () =>
          Math.floor(Math.random() * 2000)
        ),
        borderColor: "#59A2BE",
        backgroundColor: "transparent",
        fill: false,
      },
      {
        label: "Actionable Insights",
        data: Array.from({ length: 15 }, () =>
          Math.floor(Math.random() * 2000)
        ),
        borderColor: "#5A92D6",
        backgroundColor: "transparent",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    interaction: {
      intersect: false,
      mode: "nearest",
    },
    onHover: (event, chartElements) => {
      if (chartElements.length > 0) {
        const firstPoint = chartElements[0];
        const x = firstPoint.element.x;
        const dataIndex = firstPoint.index;

        updateMetricsAndDate(dataIndex); // Call to update metrics and date

        insightChart.crosshair = {
          x,
          y: insightChart.chartArea.top,
          y2: insightChart.chartArea.bottom,
          strokeStyle: "rgba(255, 255, 255, 0.1)",
          lineWidth: 1,
        };
      }
    },
  },
});

function updateMetricsAndDate(dataIndex) {
  document.querySelector(
    ".insights-date"
  ).textContent = `Date: ${labels[dataIndex]}`;
  document.getElementById("transactions-captured").textContent =
    insightChart.data.datasets[0].data[dataIndex];
  document.getElementById("transactions-reported").textContent =
    insightChart.data.datasets[1].data[dataIndex];
  document.getElementById("actionable-insights").textContent =
    insightChart.data.datasets[2].data[dataIndex];
}

// Delayed initialization to ensure chart is fully ready
setTimeout(() => {
  const latestIndex = labels.length - 1;
  updateMetricsAndDate(latestIndex); // Initialize with the latest data

  // Set initial crosshair position
  const latestDataPointX = insightChart.scales.x.getPixelForValue(
    null,
    latestIndex
  );
  insightChart.crosshair = {
    x: latestDataPointX,
    y: insightChart.chartArea.top,
    y2: insightChart.chartArea.bottom,
    strokeStyle: "rgba(255, 255, 255, 0.1)",
    lineWidth: 1,
  };
  insightChart.update();
}, 0); // setTimeout with 0 delay to defer execution until after the chart is initialized

// Function to toggle the dataset visibility and update button appearance
function toggleDatasetVisibility(chart, datasetIndex, buttonId) {
  const meta = chart.getDatasetMeta(datasetIndex);
  // Toggle the hidden property
  meta.hidden = !meta.hidden;

  // Optionally, toggle a class or style on the button to indicate state
  const button = document.getElementById(buttonId);
  if (meta.hidden) {
    button.classList.add("disabled");
  } else {
    button.classList.remove("disabled");
  }

  chart.update(); // Update the chart to reflect changes
}

// Attach event listeners to buttons
document
  .getElementById("transCapturedBtn")
  .addEventListener("click", function () {
    toggleDatasetVisibility(insightChart, 0, "transCapturedBtn");
  });
document
  .getElementById("transReportBtn")
  .addEventListener("click", function () {
    toggleDatasetVisibility(insightChart, 1, "transReportBtn");
  });
document.getElementById("insightsBtn").addEventListener("click", function () {
  toggleDatasetVisibility(insightChart, 2, "insightsBtn");
});
