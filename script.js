function openTool(toolName) {
    if (toolName === 'data-transform') {
        window.location.href = 'tools/index.html';
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加更多初始化代码
    console.log('实用工具导航已加载');
});