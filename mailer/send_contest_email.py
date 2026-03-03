"""Send contest schedule emails based on contests.json."""
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import List
from datetime import datetime
import argparse

from .utils import load_contests, filter_next_24h, build_email_text
from .templates import build_html_email


CONFIG_PATH = Path(__file__).parent / "config.json"


def load_config(path: Path = CONFIG_PATH) -> dict:
    if not path.exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def send_email(smtp_cfg: dict, subject: str, text_body: str, html_body: str, to_addrs: List[str]):
    msg = MIMEMultipart("alternative")
    msg["From"] = smtp_cfg.get("from")
    msg["To"] = ", ".join(to_addrs)
    msg["Subject"] = subject
    
    # 添加纯文本和 HTML 两个版本，HTML 版本放在后面（邮件客户端会优先显示最后的版本）
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    use_ssl = smtp_cfg.get("use_ssl", False)
    port = smtp_cfg.get("port", 465 if use_ssl else 587)
    timeout = smtp_cfg.get("timeout", 30)
    
    print(f"[INFO] 正在连接 SMTP 服务器: {smtp_cfg['host']}:{port}")
    print(f"[INFO] 使用 SSL: {use_ssl}, 超时: {timeout}秒")
    
    try:
        if use_ssl:
            server = smtplib.SMTP_SSL(smtp_cfg["host"], port, timeout=timeout)
        else:
            server = smtplib.SMTP(smtp_cfg["host"], port, timeout=timeout)
            server.starttls()
        
        print(f"[INFO] 已连接到 SMTP 服务器，正在登录...")
        server.login(smtp_cfg["username"], smtp_cfg["password"])
        print(f"[INFO] 登录成功，正在发送邮件到: {to_addrs}")
        
        server.sendmail(smtp_cfg.get("from"), to_addrs, msg.as_string())
        print("[INFO] 邮件发送成功!")
    except smtplib.SMTPAuthenticationError:
        print("[错误] SMTP 认证失败：用户名或密码错误")
        raise
    except socket.timeout:
        print(f"[错误] 连接超时：无法在 {timeout} 秒内连接到 {smtp_cfg['host']}:{port}")
        raise
    except Exception as e:
        print(f"[错误] 发送失败: {str(e)}")
        raise
    finally:
        try:
            server.quit()
        except Exception:
            pass  # 忽略关闭连接时的错误


def main(contests_json_path: str = None, dry_run: bool = True):
    base = Path(__file__).parent.parent
    cj = base / "contests.json" if contests_json_path is None else Path(contests_json_path)
    data = load_contests(str(cj))
    upcoming = filter_next_24h(data.get("contests", []))
    body = build_email_text(upcoming)
    html_body = build_html_email(upcoming)
    cnt = len(upcoming)
    title="今天有{}场比赛".format(cnt) if cnt > 0 else "未来24小时内无比赛"
    cfg = load_config()
    smtp = cfg.get("smtp")
    to_addrs = cfg.get("to", [])
    subject = cfg.get("subject", f"[CodeCal比赛提醒]{title} -{datetime.now().strftime('%Y-%m-%d')}  ")

    if not smtp or not to_addrs:
        print("[INFO] SMTP 配置或收件人未设置，进入 dry-run 模式，打印邮件内容：\n")
        print("Subject:", subject)
        print("Text Body:\n", body)
        print("\nHTML Body 已生成（支持彩色标签和可点击链接）")
        return

    if dry_run:
        print("[DRY RUN] 未实际发送，邮件将发送到:", to_addrs)
        print("Subject:", subject)
        print("Text Body:\n", body)
        print("\nHTML Body 已生成（支持彩色标签和可点击链接）")
        return

    send_email(smtp, subject, body, html_body, to_addrs)
    print("邮件已发送（或尝试发送）。")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--contests", help="contests.json path", default=None)
    parser.add_argument("--send", action="store_true", help="Actually send emails. If not provided runs dry-run")
    args = parser.parse_args()
    main(contests_json_path=args.contests, dry_run=not args.send)
