#!/bin/sh
# AI 클립을 Remotion public/ 으로 복사하고 길이를 기록한다 (src/clip-durations.json)
cd "$(dirname "$0")"
for p in fal higgsfield runway; do mkdir -p public/clips/$p; cp ../assets/clips/$p/*.mp4 public/clips/$p/ 2>/dev/null; done
python3 - <<'PY'
import json, subprocess, glob, os
d = {}
for f in sorted(glob.glob('public/clips/*/*.mp4')):
    p, k = f.split('/')[-2], os.path.basename(f)[:-4]
    dur = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
    d.setdefault(p, {})[k] = round(dur, 3)
json.dump(d, open('src/clip-durations.json','w'), indent=1)
print(json.dumps(d))
PY
