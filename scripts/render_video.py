"""Convert the recorded webm and SRT into a readable captioned MP4 (requires ffmpeg)."""

import argparse, re, subprocess
from pathlib import Path

p = argparse.ArgumentParser()
p.add_argument("directory", nargs="?", default="artifacts")
a = p.parse_args()
d = Path(a.directory)
text = (d / "demo-captions.srt").read_text()
header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 920
WrapStyle: 0
[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,DejaVu Sans,25,&H00FFFFFF,&H00FFFFFF,&H00482D13,&H00482D13,0,0,0,0,100,100,0,0,1,0,0,2,35,35,22,1
[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""


def stamp(t):
    return t.replace(",", ".")[:-1]


lines = []
for block in text.strip().split("\n\n"):
    parts = block.splitlines()
    start, end = parts[1].split(" --> ")
    caption = "\\N".join(parts[2:])
    lines.append(f"Dialogue: 0,{stamp(start)},{stamp(end)},Default,,0,0,0,,{caption}")
ass = d / "demo-captions.ass"
ass.write_text(header + "\n".join(lines) + "\n")
subprocess.run(
    [
        "ffmpeg",
        "-y",
        "-i",
        str(d / "demo-raw.webm"),
        "-vf",
        f"pad=1280:920:0:0:color=0x132d48,ass={ass}",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "23",
        "-an",
        "-movflags",
        "+faststart",
        str(d / "demo.mp4"),
    ],
    check=True,
)
