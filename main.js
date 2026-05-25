function showMenu(e) {
  e.preventDefault();
  const menus = contextMenu.getInstance();
  menus.style.top = `${e.clientY}px`;
  menus.style.left = `${e.clientX}px`;
  menus.classList.remove("hidden");
}

function showToast(message) {
            console.log("do")
            duration = 3000;
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            container.appendChild(toast);

            setTimeout(() => {
            container.removeChild(toast);
            }, duration + 500); // 延迟移除，确保动画完成
}
  
function hideMenu(event) {
  const menus = contextMenu.getInstance();
  menus.classList.add("hidden");
}

document.removeEventListener("contextmenu", showMenu);
document.removeEventListener("click", hideMenu);

// 整合现有复制功能
function copyToClipboard() {
  const selected = window.getSelection().toString().trim();
  if (selected) {
    const tempElem = document.createElement('textarea');
    tempElem.value = `${selected}\n\n—— Copyright © ${new Date().getFullYear()} ChanYeeSum\nSource: https://ChanYeeSum.github.io/CodeCal/`;
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand('copy');
    document.body.removeChild(tempElem);
  }
}

// 绑定到系统默认复制事件
document.addEventListener('copy', copyToClipboard);

// 新增分享功能
function sharePage() {
  navigator.share({
    title: document.title,
    url: window.location.href
  }).catch(console.error);
}

// 新增反馈功能
function feedback() {
  window.open('mailto:contact@ChanYeeSum.github.io?subject=ACM工具反馈');
}
// 定义更新时间函数
function updateTitleTime() {
    const now = new Date(); // 获取当前时间
    
    // 提取年、月、日
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 提取时、分、秒并补零
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 组合日期和时间字符串
    const dateString = `${year}-${month}-${day}`;
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // 更新网页标题和页面头部显示
    // document.title = `当前日期${dateString} 时间${timeString}`;
    const headerTitle = document.querySelector('.header h1');
    if (headerTitle) {
        headerTitle.textContent = `编程竞赛日历 \n - 当前时间 ${dateString} ${timeString}`;
    }
}

// PV/UV 统计功能
function initPageStats() {
    const STORAGE_KEY = 'codecal_stats';
    const VISITOR_ID_KEY = 'codecal_visitor_id';
    
    // 获取今日日期字符串 (YYYY-MM-DD)
    const getTodayStr = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    };
    
    // 生成唯一访客ID
    const generateVisitorId = () => {
        return 'uv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };
    
    // 获取或创建访客ID (UV统计)
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
        visitorId = generateVisitorId();
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    
    // 获取统计数据
    const today = getTodayStr();
    let stats = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        totalPV: 0,
        totalUV: [],
        dailyStats: {}
    };
    
    // 更新PV (页面浏览量 - 每次访问都+1)
    stats.totalPV++;
    
    // 更新UV (独立访客 - 去重)
    if (!stats.totalUV.includes(visitorId)) {
        stats.totalUV.push(visitorId);
    }
    
    // 更新每日统计
    if (!stats.dailyStats[today]) {
        stats.dailyStats[today] = { pv: 0, uv: [] };
    }
    stats.dailyStats[today].pv++;
    if (!stats.dailyStats[today].uv.includes(visitorId)) {
        stats.dailyStats[today].uv.push(visitorId);
    }
    
    // 清理超过90天的旧数据（保留更长的历史记录）
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    Object.keys(stats.dailyStats).forEach(dateStr => {
        const date = new Date(dateStr);
        if (date < ninetyDaysAgo) {
            delete stats.dailyStats[dateStr];
        }
    });
    
    // 保存统计数据
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    
    // 获取最近7天的历史记录
    const getRecentHistory = () => {
        const history = [];
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dayOfWeek = days[date.getDay()];
            
            history.push({
                date: dateStr,
                dateLabel: i === 0 ? '今天' : i === 1 ? '昨天' : `${date.getMonth() + 1}/${date.getDate()}`,
                dayOfWeek: dayOfWeek,
                pv: stats.dailyStats[dateStr]?.pv || 0,
                uv: (stats.dailyStats[dateStr]?.uv?.length || 0)
            });
        }
        return history;
    };
    
    // 计算本周统计
    const getWeeklyStats = () => {
        const history = getRecentHistory();
        return history.reduce((acc, day) => ({
            pv: acc.pv + day.pv,
            uv: acc.uv + day.uv
        }), { pv: 0, uv: 0 });
    };
    
    const weeklyStats = getWeeklyStats();
    const recentHistory = getRecentHistory();
    
    return {
        totalPV: stats.totalPV,
        totalUV: stats.totalUV.length,
        todayPV: stats.dailyStats[today]?.pv || 0,
        todayUV: stats.dailyStats[today]?.uv.length || 0,
        weeklyPV: weeklyStats.pv,
        weeklyUV: weeklyStats.uv,
        recentHistory: recentHistory
    };
}

// 渲染历史记录图表
function renderHistoryChart(history) {
    const chartEl = document.getElementById('historyChart');
    if (!chartEl) return;
    
    const maxPv = Math.max(...history.map(d => d.pv), 1);
    
    let html = `
        <div class="history-chart">
            <div class="chart-header">
                <span class="chart-title">📊 近7天访问趋势</span>
            </div>
            <div class="chart-bars">
    `;
    
    history.forEach(day => {
        const height = maxPv > 0 ? (day.pv / maxPv) * 100 : 0;
        const barClass = day.pv === 0 ? 'bar-empty' : '';
        
        html += `
            <div class="chart-bar-wrapper">
                <div class="chart-bar ${barClass}" style="height: ${height}%" title="${day.dateLabel} (周${day.dayOfWeek}): ${day.pv}次访问">
                    <span class="bar-value">${day.pv}</span>
                </div>
                <div class="chart-label">${day.dateLabel}</div>
                <div class="chart-weekday">周${day.dayOfWeek}</div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    chartEl.innerHTML = html;
}

// 在控制台显示字符图表
function printConsoleStats(stats) {
    const border = '═'.repeat(50);
    const thinBorder = '─'.repeat(50);
    
    console.log('\n');
    console.log('╔' + border + '╗');
    console.log('║          📊 CodeCal 访问统计控制台          ║');
    console.log('╠' + thinBorder + '╣');
    
    // 统计数据
    console.log('║  总访问量 (PV)  : ' + String(stats.totalPV).padStart(12) + ' 次  ║');
    console.log('║  独立访客 (UV)  : ' + String(stats.totalUV).padStart(12) + ' 人  ║');
    console.log('║  今日访问      : ' + String(stats.todayPV).padStart(12) + ' 次  ║');
    console.log('║  本周访问      : ' + String(stats.weeklyPV).padStart(12) + ' 次  ║');
    console.log('╠' + thinBorder + '╣');
    
    // 字符图表
    console.log('║           近7天访问趋势图表                  ║');
    console.log('╠' + thinBorder + '╣');
    
    const maxPv = Math.max(...stats.recentHistory.map(d => d.pv), 1);
    const chartHeight = 8;
    
    for (let row = chartHeight; row >= 0; row--) {
        let line = '║  ';
        stats.recentHistory.forEach(day => {
            const height = (day.pv / maxPv) * chartHeight;
            if (row <= height) {
                line += '█▓▒░'[Math.floor((1 - row / height) * 4)] || '█';
            } else {
                line += ' ';
            }
            line += ' ';
        });
        
        // Y轴刻度
        const label = row === chartHeight ? String(maxPv).padStart(3) :
                      row === Math.floor(chartHeight/2) ? String(Math.floor(maxPv/2)).padStart(3) :
                      row === 0 ? '  0' : '   ';
        
        line += ' ' + label + ' ║';
        console.log(line);
    }
    
    console.log('╠' + thinBorder + '╣');
    
    // X轴标签
    let labels = '║  ';
    stats.recentHistory.forEach(day => {
        labels += day.dateLabel.padEnd(4).substring(0, 4);
    });
    labels += '      ║';
    console.log(labels);
    
    console.log('╚' + border + '╝');
    console.log('\n');
}

// 页面加载后立即显示时间，并每秒更新一次
window.onload = function() {
    updateTitleTime(); // 立即执行一次
    setInterval(updateTitleTime, 1000); // 每秒更新
    
    // 初始化PV/UV统计
    const pageStats = initPageStats();
    
    // 在控制台显示统计数据和字符图表
    printConsoleStats(pageStats);
};

const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', function() {
    if (navigator.share) {
      sharePage();
    } else {
      alert('当前浏览器不支持分享功能，请手动复制链接');
    }
  });
}

// 不蒜子计数器 - 备选统计方案（仅控制台显示）
function initBusuanzi() {
    const script = document.createElement('script');
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    script.onload = function() {
        // 不蒜子加载成功后，在控制台显示统计信息
        const checkStats = setInterval(() => {
            const pv = window.busuanziValueSitePV;
            const uv = window.busuanziValueSiteUV;
            
            if (pv !== undefined || uv !== undefined) {
                clearInterval(checkStats);
                console.log('========================================');
                console.log('🌐 不蒜子统计数据 (Busuanzi Counter)');
                console.log('----------------------------------------');
                console.log(`访问量 (PV): ${pv || '加载中...'}`);
                console.log(`访客数 (UV): ${uv || '加载中...'}`);
                console.log('========================================');
            }
        }, 500);
        
        // 5秒后停止检查
        setTimeout(() => {
            clearInterval(checkStats);
        }, 5000);
    };
    script.onerror = function() {
        console.log('⚠️ 不蒜子计数器加载失败，使用本地统计方案');
    };
    document.head.appendChild(script);
}

// 初始化不蒜子计数器
initBusuanzi();