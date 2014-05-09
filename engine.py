#!/usr/bin/env python
# -*- coding: utf-8 -*-

import random
import bisect
from uuid import uuid4


class Player(object):
    """Player"""
    def __init__(self, name=None, uuid=None):
        self.name = name
        self.coins = 11
        self.score = -self.coins
        self.cards = []
        self.uuid = uuid
        print(uuid)
        if not uuid:
            self.uuid = uuid4().hex

    def __repr__(self):
        return str('%s: %s points, %s coins, %s'
                   % (self.name, self.score, self.coins, self.cards))

    def group_successive(self, cards=None):
        if not cards:
            cards = self.cards
        if not cards:
            return []
        i = cards[0]
        g = []
        l = []
        for c in cards:
            if c > i+1:
                g.append(l)
                l = [c]
            else:
                l.append(c)
            i = c
        g.append(l)
        return g

    def update_score(self):
        score = sum(g[0] for g in self.group_successive())
        self.score = score - self.coins
        return self.score

    def pick(self, c):
        bisect.insort(self.cards, c)
        self.update_score()


class Game(object):
    """Game"""
    def __init__(self, nplayer=0):
        cards = range(3, 36)
        random.shuffle(cards)
        self.deck = cards[9:]
        self.discard = cards[:9]
        self.coins = 0
        self.players = [Player('player%s' % (i+1)) for i in range(nplayer)]
        self.players_by_uuid = {}
        self.nextplayer = None
        self.cardup = None
        self.started = False

    def __repr__(self):
        player = None
        if self.players and self.nextplayer:
            player = self.nextplayer
        return ('Card up: %s (%s coins)\nNext Player: %s\nDeck (%s): %s'
                % (
                    str(self.cardup),
                    str(self.coins),
                    str(player),
                    str(len(self.deck)),
                    ' '.join(map(str, self.deck))
                ))

    def addplayer(self, name=None, uuid=None):
        if not self.started and name not in [p.name for p in self.players]:
            self.players.append(Player(name, uuid))

    def play(self, nothanks=True, player=None):
        if not self.started:
            print('Game not started yet')
            return
#        if len(self.deck) == 0:
#            print('Game is over (%s won)' % self.end(True))
        if not player:
            player = self.nextplayer
        if nothanks:
            if player.coins > 0:
                self.nextplayer = self.players[
                    (self.players.index(self.nextplayer)+1) % len(self.players)
                ]
                player.coins -= 1
                player.score += 1
                self.coins += 1
            else:
                print('impossible to pass!')
                nothanks = False
        if not nothanks:
            player.coins += self.coins
            player.pick(self.cardup)
            self.coins = 0
            try:
                self.cardup = self.deck.pop()
            except IndexError:
                self.cardup = 0
                print('Just played: %s' % player)
                print(self)
                return False
        print('Just played: %s' % player)
        print(self)
        return True

    def start(self):
        if not self.started and len(self.players) >= 2:
            players = self.players
            if len(self.deck) == 0:
                self.__init__()
            self.players = players
            self.nextplayer = random.choice(self.players)
            self.players_by_uuid = {p.uuid: p for p in self.players}
            self.started = True
            self.cardup = self.deck.pop()
            print(self)

    def end(self, get_winner=True):
        self.started = False
        for p in self.players:
            p.update_score()
        p = {
            p.uuid: p.score
            for p in sorted(self.players, key=lambda p: p.score)
        }
        winner = sorted(p.items(), key=lambda i: i[1])[0]
        for player in self.players:
            print(player)
        print('The winner is %s (%s)' % (winner[0], winner[1]))
        self.players = []
        if get_winner:
            return p

if __name__ == '__main__':
    g = Game(3)
    g.start()
