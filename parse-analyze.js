const fs = require("fs");

const html = fs.readFileSync(".next/analyze/client.html", "utf-8");
const match = html.match(/window\.chartData = (\[.*?\]);/);
if (match) {
  const chartData = JSON.parse(match[1]);
  const modules = [];

  function traverse(node, path) {
    if (node.groups) {
      node.groups.forEach(g => traverse(g, path ? `${path}/${node.label}` : node.label));
    } else {
      modules.push({ label: path ? `${path}/${node.label}` : node.label, parsedSize: node.parsedSize, statSize: node.statSize });
    }
  }

  chartData.forEach(d => traverse(d, ""));
  modules.sort((a, b) => b.parsedSize - a.parsedSize);

  console.log("Top 10 Client Modules:");
  modules.slice(0, 10).forEach(m => {
    console.log(`${(m.parsedSize / 1024).toFixed(2)} KB - ${m.label}`);
  });
} else {
  console.log("Could not find chartData");
}
