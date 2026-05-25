"""HTML templates for email formatting."""
import base64

CALENDAR_CSS = """
.calendar-cta { margin: 20px 0; padding: 16px; background: #f0f7ff; border: 2px solid #0366d6; border-radius: 8px; text-align: center; }
.calendar-cta a { display: inline-block; padding: 12px 24px; background: #0366d6; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
.calendar-cta a:hover { background: #0256b9; }
.calendar-cta p { margin: 8px 0 0; color: #555; font-size: 13px; }
.calendar-note { margin-top: 15px; padding: 12px; background: #fef3cd; border: 1px solid #ffc107; border-radius: 6px; font-size: 13px; color: #856404; }
"""

CSS = """body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
.contest-list { list-style: none; padding: 0; }
.contest-item { margin-bottom: 20px; padding: 15px; border: 1px solid #e1e4e8; border-radius: 6px; background: #fff; }
.contest-header { display: flex; align-items: center; margin-bottom: 10px; }
.platform-tag { font-size: 12px; padding: 3px 8px; border-radius: 12px; margin-right: 10px; }
.tag-AtCoder { background: #3498db; color: white; }
.tag-Codeforces { background: #e74c3c; color: white; }
.tag-LeetCode { background: #f1c40f; color: black; }
.tag-luogu { background: #9b59b6; color: white; }
.tag-NowCoder { background: #2ecc71; color: white; }
.contest-name { font-size: 16px; font-weight: 600; }
.contest-info { margin-left: 10px; color: #666; font-size: 14px; }
.contest-link { display: inline-block; margin-top: 8px; color: #0366d6; text-decoration: none; }
.contest-link:hover { text-decoration: underline; }
.header { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e1e4e8; }
.footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e1e4e8; color: #666; font-size: 14px; }
.footer a { color: #0366d6; text-decoration: none; }
.footer a:hover { text-decoration: underline; }""" + CALENDAR_CSS

HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
{style}
</style>
</head>
<body>
<div class="header">
    <h2>{title}</h2>
    <p>{subtitle}</p>
</div>
{cta_section}
<ul class="contest-list">
    {contests}
</ul>
{calendar_note}
<div class="footer">
 <p>📅 竞赛日历：<a href="https://ChanYeeSum.github.io/CodeCal/" target="_blank">https://ChanYeeSum.github.io/CodeCal/</a></p>
 <p>💡 您可以点击上方按钮将今日比赛一键添加到日历，或下载邮件附件中的 .ics 文件</p>
</div>
</body>
</html>
"""

CONTEST_ITEM_TEMPLATE = """
<li class="contest-item">
    <div class="contest-header">
        <span class="platform-tag tag-{platform}">{platform}</span>
        <span class="contest-name">{name}</span>
    </div>
    <div class="contest-info">
        开始时间: {start_time}<br>
        结束时间: {end_time}<br>
        时长: {duration}
    </div>
    <a href="{url}" class="contest-link" target="_blank">查看详情 →</a>
</li>
"""

def format_contest_html(contest):
    """Format a single contest into HTML."""
    return CONTEST_ITEM_TEMPLATE.format(
        platform=contest.get("platform", "Other"),
        name=contest.get("name", ""),
        start_time=contest["start_dt"].strftime("%Y-%m-%d %H:%M:%S"),
        end_time=contest["end_dt"].strftime("%Y-%m-%d %H:%M:%S"),
        duration=contest.get("duration", ""),
        url=contest.get("url", "#")
    )

def build_html_email(contests, title="比赛提醒", ics_content=None):
    """Build full HTML email content."""
    cta_section = ""
    calendar_note = ""

    if contests:
        if ics_content:
            ics_b64 = base64.b64encode(ics_content.encode("utf-8")).decode("ascii")
            data_uri = f"data:text/calendar;base64,{ics_b64}"
            cta_section = f"""
<div class="calendar-cta">
    <a href="{data_uri}" download="codecal-today.ics">📅 一键添加到日历</a>
    <p>点击下载 .ics 文件并用日历应用打开即可添加</p>
</div>"""
        else:
            cta_section = ""

        calendar_note = """<div class="calendar-note">📎 本邮件附件包含 .ics 日历文件，可下载后用日历应用（如 Outlook、Apple 日历、Google 日历）一键打开添加。</div>"""
    else:
        cta_section = ""

    if not contests:
        return HTML_TEMPLATE.format(
            style=CSS,
            title=title,
            subtitle="未来24小时内没有检测到新的比赛。",
            cta_section="",
            contests="",
            calendar_note=""
        )

    contests_html = "\n".join(format_contest_html(c) for c in contests)
    return HTML_TEMPLATE.format(
        style=CSS,
        title=title,
        subtitle="以下为未来24小时内的比赛日程：",
        cta_section=cta_section,
        contests=contests_html,
        calendar_note=calendar_note
    )
