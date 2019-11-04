#!/usr/bin/python3

GRID = (('', '', 'panama', '', '', '', '', '', '', '', 'bell', '', 'echo'),
        ('bell', '', '', '', '', '', '', '', '', '', 'hounds', 'crickets', ''),
        ('grammar', 'surprise', '', '', '', '', '', '', 'hallelujah', '', 'bell', '', 'bell'),
        ('', '', '', '', '', '', '', '', 'bell', '', '', 'soldiers', 'clock'),
        ('bell', '', '', '', 'bell', '', '', '', '', 'horn', '', '', ''),
        ('', '', '', '', 'chicken', '', '', '', '', '', '', 'bell', ''),
        ('', '', '', 'bell', '', '', '', 'growl', '', '', '', '', ''),
        ('', '', '', '', '', '', '', '', '', '', '', '', ''))

ROWS = 8
COLS = 13
START_ROW = 4
START_COL = 6
DIRS = ((-1, 0), (0, 1), (1, 0), (0, -1))   # row, col
START_HEADING = 0  # north


import argparse
import asyncio
import json
import os
import time

import http.client
import tornado.web

import scrum


class GameState:
  BY_KEY = {}

  @classmethod
  def set_globals(cls, options):
    cls.options = options

  @classmethod
  def get_for_session(cls, session, wid):
    key = (session, wid)
    if key not in cls.BY_KEY:
      cls.BY_KEY[key] = cls()
    return cls.BY_KEY[key]

  def __init__(self):
    self.pos = (START_ROW, START_COL)
    self.heading = START_HEADING

  def forward_to(self):
    pos = (self.pos[0] + DIRS[self.heading][0], self.pos[1] + DIRS[self.heading][1])
    good = (0 <= pos[0] < ROWS) and (0 <= pos[1] < COLS)
    return pos, good

  def move(self, choice):
    d = {}

    if choice == "startover":
      d["audio"] = self.options.assets["intro.m4a"]
      self.pos = (START_ROW, START_COL)
      self.heading = START_HEADING
      d["forward"] = True
    elif choice == "forward":
      new_pos, good = self.forward_to()
      if not good:
        return None
      self.pos = new_pos

      next_pos, good = self.forward_to()
      if good: d["forward"] = True

      a = GRID[self.pos[0]][self.pos[1]]
      if a:
        d["audio"] = self.options.assets[a + ".m4a"]
    elif choice == "left":
      self.heading = (self.heading + 3) % 4
      next_pos, good = self.forward_to()
      if good: d["forward"] = True
    elif choice == "right":
      self.heading = (self.heading + 1) % 4
      next_pos, good = self.forward_to()
      if good: d["forward"] = True
    else:
      return None

    d["room"] = 1 + self.pos[0]*13 + self.pos[1]
    return d


class MoveHandler(tornado.web.RequestHandler):
  async def get(self, wid, choice):
    scrum_app = self.application.settings["scrum_app"]
    team, session = await scrum_app.check_cookie(self)
    wid = int(wid)

    gs = GameState.get_for_session(session, wid)

    d = gs.move(choice)
    if d:
      self.write(json.dumps(d))
    else:
      raise tornado.web.HTTPError(http.client.BAD_REQUEST)


class DebugHandler(tornado.web.RequestHandler):
  def get(self, fn):
    if fn.endswith(".css"):
      self.set_header("Content-Type", "text/css")
    elif fn.endswith(".js"):
      self.set_header("Content-Type", "application/javascript")
    with open(fn) as f:
      self.write(f.read())


def make_app(options):
  GameState.set_globals(options)
  handlers = [(r"/tunmove/(\d+)/(\S+)", MoveHandler)]
  if options.debug:
    handlers.append((r"/tundebug/(\S+)", DebugHandler))
  return handlers


def main():
  parser = argparse.ArgumentParser(description="Run the Tunnel of Love puzzle.")
  parser.add_argument("--debug", action="store_true",
                      help="Run in debug mode.")
  parser.add_argument("--assets_json", default=None,
                      help="JSON file for sound assets")
  parser.add_argument("-c", "--cookie_secret",
                      default="snellen2020",
                      help="Secret used to create session cookies.")
  parser.add_argument("--listen_port", type=int, default=2004,
                      help="Port requests from frontend.")
  parser.add_argument("--main_server_port", type=int, default=2020,
                      help="Port to use for requests to main server.")

  options = parser.parse_args()

  assert options.assets_json
  with open(options.assets_json) as f:
    options.assets = json.load(f)

  app = scrum.ScrumApp(options, make_app(options))
  app.start()


if __name__ == "__main__":
  main()

