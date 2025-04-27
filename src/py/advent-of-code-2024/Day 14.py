"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

ROOM_W = 101
ROOM_H = 103

data = open("input14.txt", "r").read()

class Robot:
    def __init__(self, x, y, vx, vy):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
    
    def step(self):
        self.x += self.vx
        self.y += self.vy
        if self.x >= ROOM_W:
            self.x -= ROOM_W
        if self.x < 0:
            self.x += ROOM_W
        if self.y >= ROOM_H:
            self.y -= ROOM_H
        if self.y < 0:
            self.y += ROOM_H

def parse(data):
    data = data.split("\n")
    
    robots = []
    for line in data:
        p = list(map(int, line[2:line.index(" ")].split(",")))
        v = list(map(int, line[line.index("v=")+2:].split(",")))
        robots.append(Robot(p[0], p[1], v[0], v[1]))
    return robots

def room_to_string(robots):
    room = [[0 for x in range(ROOM_W)] for y in range(ROOM_H)]
    
    for robot in robots:
        room[robot.y][robot.x] += 1
    
    string = ""
    for row in room:
        string += "".join(map(lambda x: "." if x == 0 else str(x), row)) + "\n"
    return string
    
def count_quadrant(robots, x, y, w, h):
    count = 0
    for robot in robots:
        if robot.x >= x and robot.x < x + w and robot.y >= y and robot.y < y + h:
            count += 1
    return count

def no_overlaps(robots):
    positions = []
    for robot in robots:
        pos = (robot.x, robot.y)
        if pos in positions:
            return False
        else:
            positions.append(pos)
    return True

def puzzle_1(robots):
    for i in range(100):
        for robot in robots:
            robot.step()
        
    return count_quadrant(robots, 0, 0, ROOM_W // 2, ROOM_H // 2) * \
        count_quadrant(robots, ROOM_W // 2 + 1, 0, ROOM_W // 2, ROOM_H // 2) * \
        count_quadrant(robots, 0, ROOM_H // 2 + 1, ROOM_W // 2, ROOM_H // 2) * \
        count_quadrant(robots, ROOM_W // 2 + 1, ROOM_H // 2 + 1, ROOM_W // 2, ROOM_H // 2)

def puzzle_2(robots):
    i = 0
    while not no_overlaps(robots):
        for robot in robots:
            robot.step()
        i += 1
    return i

print("Puzzle 1 Solution:", puzzle_1(parse(data)))
print("Puzzle 2 Solution:", puzzle_2(parse(data)))