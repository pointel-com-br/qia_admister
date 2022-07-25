#!/usr/bin/env python3
import os
import sys


def install():
    print("Installing...")
    if not os.path.isdir("node_modules"):
        os.system("npm install")


def generate():
    print("Generating...")
    for path in os.listdir("."):
        if path.startswith("mk_") and path.endswith(".py"):
            with open(path) as file:
                exec(file.read(), globals())


def build():
    print("Building...")
    os.system("npx tsc --build --verbose")


def generate_and_build():
    generate()
    build()


if __name__ == "__main__":
    generate_and_build()
else:
    sys.modules[__name__] = generate_and_build
