import os
import shutil
from enum import Enum

import gen_build
import pk_browser


class Mode(Enum):
    TEST = 0
    PROD = 1


class Kind(Enum):
    APP = 0
    PUB = 1


def make(name: str, mode: Mode, kind: Kind):
    qin_root = os.environ['QIN_ROOT']
    gen_build()
    pk_browser("production" if mode == Mode.PROD else "development")
    if os.path.isdir("public"):
        print("Publishing...")
        destiny = f"{qin_root}/{'Prod' if mode == Mode.PROD else 'Test'}/{'pub' if kind == Kind.PUB else 'app'}/{name}"
        shutil.copytree("./public", destiny, dirs_exist_ok=True)
