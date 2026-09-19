import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from db import initialize

initialize()
print("Public catalog initialized; existing content preserved.")
