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
outDir =    f"{rootDir}/build/{platform}"

#TODO: add chromium support
if platform == "chromium":
    print("Chromium not yet supported")
    sys.exit(0)

os.makedirs(cacheDir, exist_ok=True)
os.makedirs(outDir, exist_ok=True)

shutil.copy(f"{rootDir}/LICENSE", f"{cacheDir}/LICENSE")
shutil.copy(f"{srcDir}/manifest-{platform}.json", f"{cacheDir}/manifest.json")

shutil.copytree(
    srcDir, cacheDir, True,
    ignore=shutil.ignore_patterns("manifest*", "build"),
    dirs_exist_ok=True
)

removeSilent(f"{outDir}/shortsearch.zip")
shutil.make_archive(f"{outDir}/shortsearch", "zip", cacheDir)

if args.clean:
    removeSilent(cacheDir)
