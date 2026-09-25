#!/usr/bin/env python3
"""
本地运行脚本：网页服务 + 后台定时拉取比赛数据，单命令启动。

    python scheduler.py

- 网页：http://localhost:8080/ （zh-CN / en 双语，根路径按浏览器语言自动跳转）
- 数据：启动时立即抓取一次，之后每 60 分钟自动更新 contests.json
  （线上由 GitHub Actions 每 15 分钟刷新，本地需本脚本保持数据最新）

Ctrl+C 停止。
"""
import threading
import time
import traceback
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from contest_fetcher import ContestFetcher

PORT = 8080
INTERVAL_SECONDS = 60 * 60  # 1 小时

ROOT = Path(__file__).resolve().parent


class QuietHandler(SimpleHTTPRequestHandler):
    """静默逐条的静态资源访问日志，突出抓取进度输出。"""

    def log_message(self, format, *args):
        pass


def start_web_server():
    handler = partial(QuietHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("", PORT), handler)  # 端口占用时在此抛错，启动即失败
    threading.Thread(target=server.serve_forever, daemon=True).start()
    print(f'web: http://localhost:{PORT}/')


def main():
    start_web_server()
    fetcher = ContestFetcher()
    while True:
        started = time.strftime('%Y-%m-%d %H:%M:%S')
        print(f'[{started}] fetching contests...')
        try:
            fetcher.run()
        except Exception:
            traceback.print_exc()
            print(f'[{started}] fetch failed, will retry after interval')
        time.sleep(INTERVAL_SECONDS)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\nstopped')
