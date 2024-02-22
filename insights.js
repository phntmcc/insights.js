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

// Custom plugin for drawing a vertical line
Chart.register({
  id: "crosshairPlugin",
  afterDraw: function (chart) {
    if (chart.crosshair && chart.crosshair.x !== undefined) {
      const ctx = chart.ctx;
      const { x, y, y2, strokeStyle, lineWidth } = chart.crosshair;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y2);
      ctx.strokeStyle = strokeStyle || "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = lineWidth || 1;
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
      if (chartElements.length) {
        const firstPoint = chartElements[0];
        const x = firstPoint.element.x;
        const y = insightChart.chartArea.top;
        const y2 = insightChart.chartArea.bottom;

        insightChart.crosshair = {
          x,
          y,
          y2,
          strokeStyle: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        };
      }
      // Note: Removed the else clause to keep the line displayed
    },
  },
});

// Set initial crosshair to the latest data point
const latestDataPointX = insightChart.scales.x.getPixelForValue(
  null,
  labels.length - 1
);
insightChart.crosshair = {
  x: latestDataPointX,
  y: insightChart.chartArea.top,
  y2: insightChart.chartArea.bottom,
  strokeStyle: "rgba(0, 0, 0, 0.1)",
  lineWidth: 1,
};
insightChart.update();
