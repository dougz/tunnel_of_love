#!/usr/bin/python3

import argparse
import os
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument("--debug", action="store_true")
options = parser.parse_args()

with zipfile.ZipFile("tunnel_of_love.zip", mode="w") as z:
  with z.open("puzzle.html", "w") as f_out:
    with open("tunnel_of_love.html", "rb") as f_in:

      html = f_in.read()

      if options.debug:
        head = ('<link rel=stylesheet href="/tundebug/tunnel_of_love.css" />'
                '<script src="/closure/goog/base.js"></script>'
                '<script src="/tundebug/tunnel_of_love.js"></script>')
      else:
        head = ('<link rel=stylesheet href="tunnel_of_love.css" />'
                '<script src="tunnel_of_love-compiled.js"></script>')

      html = html.replace(b"@HEAD@", head.encode("utf-8"))

      f_out.write(html)

  with z.open("solution.html", "w") as f_out:
    with open("solution.html", "rb") as f_in:
      f_out.write(f_in.read())

  with z.open("for_ops.html", "w") as f_out:
    with open("for_ops.html", "rb") as f_in:
      f_out.write(f_in.read())

  with z.open("metadata.yaml", "w") as f_out:
    with open("metadata.yaml", "rb") as f_in:
      f_out.write(f_in.read())

  if not options.debug:
    with z.open("tunnel_of_love.css", "w") as f_out:
      with open("tunnel_of_love.css", "rb") as f_in:
        f_out.write(f_in.read())

    with z.open("tunnel_of_love-compiled.js", "w") as f_out:
      with open("tunnel_of_love-compiled.js", "rb") as f_in:
        f_out.write(f_in.read())

  for fn in os.listdir("sounds"):
    with z.open(fn, "w") as f_out:
      with open(os.path.join("sounds", fn), "rb") as f_in:
        f_out.write(f_in.read())

  for fn in ("left.png", "right.png", "forward.png"):
    with z.open(fn, "w") as f_out:
      with open(fn, "rb") as f_in:
        f_out.write(f_in.read())






