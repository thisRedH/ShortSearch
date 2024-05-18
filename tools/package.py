import os
import sys
import shutil
import argparse

def removeSilent(path):
    try:
        shutil.rmtree(path)
    except OSError:
        pass

parser = argparse.ArgumentParser(
    description="Packages shortsearch",
)
parser.add_argument("platform", choices=["chromium", "gecko"])
parser.add_argument(
    "-c", "--clean", action="store_true",
    help="Clean Cache when done directory"
)
args = parser.parse_args()

platform =  args.platform
rootDir =   f"{os.getcwd()}"
srcDir =    f"{rootDir}/shortsearch"
cacheDir =  f"{rootDir}/build/cache/{platform}"
outDir =    f"{rootDir}/build"

os.makedirs(cacheDir, exist_ok=True)
os.makedirs(outDir, exist_ok=True)

with open(f"{rootDir}/VERSION", "r", encoding="utf-8") as f:
    version = f.readline().strip()

with open(f"{srcDir}/manifest-{platform}.json", "r", encoding="utf-8") as f:
    manifest = f.read()

with open(f"{cacheDir}/manifest.json", "w", encoding="utf-8") as f:
    manifest = manifest.replace("{{VERSION}}", version)
    f.write(manifest)

shutil.copy(f"{rootDir}/LICENSE", f"{cacheDir}/LICENSE")
shutil.copytree(
    srcDir, cacheDir, True,
    ignore=shutil.ignore_patterns("manifest*", "build"),
    dirs_exist_ok=True
)

removeSilent(f"{outDir}/shortsearch_{platform}.zip")
shutil.make_archive(f"{outDir}/shortsearch_{platform}", "zip", cacheDir)

if args.clean:
    removeSilent(cacheDir)
