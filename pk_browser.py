#!/usr/bin/env python3
import os
import sys


def pack_browser(mode: str):
    print("Packing...")
    if not os.path.exists('webpack.config.js'):
        print("There is nothing to be packed.")
        return
    os.system(f"npx webpack build --no-stats --mode {mode}")


if __name__ == "__main__":
    pack_browser("development")
else:
    sys.modules[__name__] = pack_browser
