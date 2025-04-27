"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

from bitboard import Bitboard

LOCK_W = 5
LOCK_H = 7

LOCK_PATTERN = Bitboard(LOCK_W, LOCK_H)
LOCK_PATTERN.data[0] = 2 ** LOCK_W - 1
BLANK_PATTERN = Bitboard(LOCK_W, LOCK_H)

data = open("input25.txt", "r").read()

def parse(data):
    locks = []
    keys = []
    
    for item in data.split("\n\n"):
        item = item.split("\n")
        board = Bitboard(LOCK_W, LOCK_H)
        for y in range(LOCK_H):
            for x in range(LOCK_W):
                board.set(x, y, item[y][x] == "#")
        
        if board & LOCK_PATTERN == LOCK_PATTERN:
            locks.append(board)
        else:
            keys.append(board)
    
    return locks, keys

def puzzle_1(data):
    locks, keys = data
    
    total = 0
    for lock in locks:
        for key in keys:
            if lock & key == BLANK_PATTERN:
                total += 1
    
    return total

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(parse(data)))
print("Puzzle 2 Solution:", puzzle_2(data))