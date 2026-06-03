const fs = require('fs');
const files = ['src/App.tsx', 'src/components/ReflectPanel.tsx', 'src/components/MetricsDashboard.tsx'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/bg-\[#f9f9f8\]/g, 'bg-[#161616]');
    content = content.replace(/bg-\[#f0f0ee\]/g, 'bg-[#1c1c1c]');
    content = content.replace(/bg-white/g, 'bg-[#212121]');
    content = content.replace(/text-\[#1d1d1b\]/g, 'text-[#ececec]');
    content = content.replace(/border-b-2 border-\[#1d1d1b\]/g, 'border-b-2 border-[#ececec]');
    content = content.replace(/border-\[#1d1d1b\]/g, 'border-[#ececec]');
    content = content.replace(/bg-\[#3d3d3d\]/g, 'bg-[#ececec]');
    content = content.replace(/text-\[#6e6e6a\]/g, 'text-[#a3a3a3]');
    content = content.replace(/text-\[#3d3d3d\]/g, 'text-[#d4d4d4]');
    content = content.replace(/border-\[#e5e5e2\]/g, 'border-[#383838]');
    content = content.replace(/bg-\[#1d1d1b\]/g, 'bg-[#ececec]');
    content = content.replace(/bg-\[#e5e5e2\]/g, 'bg-[#383838]');
    content = content.replace(/hover:bg-\[#e9e9e6\]/g, 'hover:bg-[#2f2f2f]');
    content = content.replace(/prose-stone/g, 'prose-invert');
    content = content.replace(/border-\[#b7dfc3\]/g, 'border-[#2d4d35]');
    content = content.replace(/border-\[#fde68a\]/g, 'border-[#5c4918]');
    content = content.replace(/border-\[#fecaca\]/g, 'border-[#6c2828]');
    content = content.replace(/hover:border-\[#1d1d1b\]/g, 'hover:border-[#ececec]');
    fs.writeFileSync(file, content);
  }
});
