#!/usr/bin/env python3

import os
import shutil

import gen_build
import pk_public

qin_root = os.environ['QIN_ROOT']
gen_build()
pk_public("development")
shutil.copytree(
    "./public", f"{qin_root}/Test/app/admister", dirs_exist_ok=True)
