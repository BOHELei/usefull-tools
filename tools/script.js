// 获取DOM元素
const backBtn = document.getElementById('back-btn');
const inputData = document.getElementById('input-data');
const outputData = document.getElementById('output-data');
const separatorInput = document.getElementById('separator');
const transposeBtn = document.getElementById('transpose-btn');
const resetBtn = document.getElementById('reset-btn');
const clearInputBtn = document.getElementById('clear-input');
const copyResultBtn = document.getElementById('copy-result');
const downloadResultBtn = document.getElementById('download-result');

// 事件监听器
backBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
});
transposeBtn.addEventListener('click', transposeData);
resetBtn.addEventListener('click', resetAll);
clearInputBtn.addEventListener('click', () => {
    inputData.value = '';
});
copyResultBtn.addEventListener('click', copyResult);
downloadResultBtn.addEventListener('click', downloadResult);

// 重置所有内容
function resetAll() {
    inputData.value = '';
    outputData.value = '';
    inputTable.innerHTML = '';
    outputTable.innerHTML = '';
}


// 解析输入数据
function parseInputData() {
    const text = inputData.value.trim();
    if (!text) return null;
    
    const separator = separatorInput.value || ',';
    return parseCSV(text, separator);
}

// 解析CSV数据 - 将所有行作为数据，不区分表头
function parseCSV(csvText, separator = ',') {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // 获取最大列数
    const maxCols = Math.max(...lines.map(line => line.split(separator).length));
    
    // 为每列生成列名
    const headers = Array.from({length: maxCols}, (_, i) => `col${i + 1}`);
    const data = [];
    
    // 处理所有行作为数据
    for (let i = 0; i < lines.length; i++) {
        const values = lines[i].split(separator).map(value => value.trim());
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    return data;
}

// 将数据转换为CSV格式
function toCSV(data, separator = ',') {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // 添加数据行（不包含标题行）
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // 如果值中包含分隔符或引号，需要用引号包围
            if (typeof value === 'string' && (value.includes(separator) || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(separator));
    });
    
    return csvRows.join('\n');
}


// 行列转换核心函数
function transposeData() {
    try {
        const data = parseInputData();
        if (!data || data.length === 0) {
            alert('请输入有效的数据');
            return;
        }
        
        // 执行行列转换
        const transposed = transposeRowsCols(data);
        
        // 转换为CSV格式显示结果
        const separator = separatorInput.value || ',';
        outputData.value = toCSV(transposed, separator);
    } catch (error) {
        alert('数据处理错误: ' + error.message);
        console.error(error);
    }
}

// 行列转换逻辑 - 不包含字段名和行名
function transposeRowsCols(data) {
    if (!data || data.length === 0) return [];
    
    const headers = Object.keys(data[0]);
    const transposed = [];
    
    // 为每个原始列创建一个新行
    headers.forEach((header, index) => {
        const newRow = {};
        
        // 为每个原始行创建一个新列
        data.forEach((row, rowIndex) => {
            // 使用列索引作为键，不包含行名
            newRow[rowIndex] = row[header];
        });
        
        transposed.push(newRow);
    });
    
    return transposed;
}

// 复制结果到剪贴板
function copyResult() {
    if (!outputData.value.trim()) {
        alert('没有可复制的结果');
        return;
    }
    
    outputData.select();
    document.execCommand('copy');
    alert('结果已复制到剪贴板');
}

// 下载结果
function downloadResult() {
    if (!outputData.value.trim()) {
        alert('没有可下载的结果');
        return;
    }
    
    const separator = separatorInput.value || ',';
    const extension = separator === ',' ? 'csv' : 'txt';
    const mimeType = 'text/csv';
    
    const blob = new Blob([outputData.value], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `转换结果.${extension}`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载示例数据
    loadSampleData();
});