#!/usr/bin/env python3

import os
import sys
from typing import List

search_for = ["export class ", "export abstract class ", "export type ", "export interface ",
              "export enum ", "export const ", "export function "]


def get_exported(line: str) -> str:
    line = line.strip()
    for searching in search_for:
        if line.startswith(searching):
            start_at = -1
            for index in range(len(searching), len(line)):
                if start_at == -1:
                    if line[index] != ' ':
                        start_at = index
                else:
                    if line[index] in [' ', '<', '(', '{', '=']:
                        return line[start_at:index]
    return ""


def get_all(source: str) -> List[str]:
    results: List[str] = []
    with open("src/" + source, "r") as file:
        for line in file.readlines():
            exported = get_exported(line)
            if exported:
                link = "./" + os.path.splitext(source)[0]
                results.append(
                    'export { ' + exported + ' } from "' + link + '";')
    return results


def mk_all():
    print("Making 'src/all.ts'...")
    if not os.path.exists('src/all.ts'):
        print("Does not need to make an all.ts source.")
        return
    founds: List[str] = []
    for source in os.listdir("src"):
        if source.endswith(".ts"):
            founds.extend(get_all(source))
    founds.sort()
    with open("src/all.ts", "w") as file:
        for found in founds:
            file.write(found)
            file.write("\n")


if __name__ == "__main__":
    mk_all()
else:
    sys.modules[__name__] = mk_all
