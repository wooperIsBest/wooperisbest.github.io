"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

from collections import Counter

data = open("input11.txt", "r").read()

class Stones:
    def __init__(self, stones):
        self.stones = Counter(stones)

    def blink(self):
        new_stones = Counter()
        for elem, count in self.stones.items():
            digits = str(elem)
            if elem == 0:
                new_stones[1] += count
            elif len(digits) % 2 == 0:
                new_stones[int(digits[:len(digits) // 2])] += count
                new_stones[int(digits[len(digits) // 2:])] += count
            else:
                new_stones[elem * 2024] += count
        self.stones = new_stones

def puzzle_1(data):
    stones = Stones(map(int, data.split(" ")))
    for i in range(25):
        stones.blink()
        print(i)
    
    return stones.stones.total()


def puzzle_2(data):
    stones = Stones(map(int, data.split(" ")))
    for i in range(75):
        stones.blink()
        print(i)
    
    return stones.stones.total()

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))