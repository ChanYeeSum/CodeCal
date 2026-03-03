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

// 页面加载后立即显示时间，并每秒更新一次
window.onload = function() {
    updateTitleTime(); // 立即执行一次
    setInterval(updateTitleTime, 1000); // 每秒更新
    
    // 访问统计功能
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
    document.getElementById('visitCount').textContent = visitCount;
};

document.getElementById('shareBtn').addEventListener('click', function() {
  if (navigator.share) {
    sharePage();
  } else {
    alert('当前浏览器不支持分享功能，请手动复制链接');
  }
});