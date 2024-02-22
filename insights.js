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
    onHover: (event, chartElements, chart) => {
      if (chartElements.length) {
        const firstPoint = chartElements[0];
        const x = firstPoint.element.x;
        const y = chart.chartArea.top;
        const x2 = firstPoint.element.x;
        const y2 = chart.chartArea.bottom;

        // Update the crosshair properties
        chart.crosshair = {
          x,
          y,
          x2,
          y2,
          strokeStyle: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        };
      } else {
        // Clear the crosshair
        delete chart.crosshair;
      }
      chart.draw();
    },
  },
});

function updateInsightsDateAndMetrics(dataIndex = labels.length - 1) {
  const currentDateLabel = labels[dataIndex];
  document.querySelector(".insights-date").textContent = `${currentDateLabel}`;
  document.getElementById("transactions-captured").textContent =
    insightChart.data.datasets[0].data[dataIndex];
  document.getElementById("transactions-reported").textContent =
    insightChart.data.datasets[1].data[dataIndex];
  document.getElementById("actionable-insights").textContent =
    insightChart.data.datasets[2].data[dataIndex];
}

// Custom Legend Functionality
function toggleDataset(datasetIndex, buttonId) {
  var meta = insightChart.getDatasetMeta(datasetIndex);
  meta.hidden = !meta.hidden;
  insightChart.update();

  var button = document.getElementById(buttonId);
  if (meta.hidden) {
    button.classList.add("disabled");
  } else {
    button.classList.remove("disabled");
  }
}

document
  .getElementById("transCapturedBtn")
  .addEventListener("click", () => toggleDataset(0, "transCapturedBtn"));
document
  .getElementById("transReportBtn")
  .addEventListener("click", () => toggleDataset(1, "transReportBtn"));
document
  .getElementById("insightsBtn")
  .addEventListener("click", () => toggleDataset(2, "insightsBtn"));

// Initial update with the latest metrics and setup hover interaction
updateInsightsDateAndMetrics();
insightChart.options.onHover = (event, chartElement) => {
  if (chartElement.length > 0) {
    const dataIndex = chartElement[0].index;
    updateInsightsDateAndMetrics(dataIndex);
  }
};
