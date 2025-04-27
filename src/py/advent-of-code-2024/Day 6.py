"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input6.txt", "r").read()

class Dir:
    UP = (0, -1)
    RIGHT = (1, 0)
    DOWN = (0, 1)
    LEFT = (-1, 0)

class Guard:
    def __init__(self, x, y, dir):
        self.x = x
        self.y = y
        self.dir = dir
        self.visits = [(self.x, self.y)]
    
    def step(self, grid):
        next_x = self.x + self.dir[0]
        next_y = self.y + self.dir[1]

        if next_y < 0 or next_y >= len(grid) or next_x < 0 or next_x >= len(grid[next_y]):
            return False
        
        if grid[next_y][next_x] == "#":
            match self.dir:
                case Dir.UP:
                    self.dir = Dir.RIGHT
                case Dir.RIGHT:
                    self.dir = Dir.DOWN
                case Dir.DOWN:
                    self.dir = Dir.LEFT
                case Dir.LEFT:
                    self.dir = Dir.UP
        
        next_x = self.x + self.dir[0]
        next_y = self.y + self.dir[1]

        if next_y < 0 or next_y >= len(grid) or next_x < 0 or next_x >= len(grid[next_y]):
            return False
        
        self.x = next_x
        self.y = next_y
        if not (self.x, self.y) in self.visits:
            self.visits.append((self.x, self.y))

        return True
        
def find_guard(data):
    for row in range(len(data)):
        for col in range(len(data[row])):
            if data[row][col] == "^":
                return Guard(col, row, Dir.UP)

def puzzle_1(data):
    data = data.split("\n")

    guard = find_guard(data)
    while guard.step(data):
        pass
    
    return len(guard.visits)

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))