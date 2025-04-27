"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input8.txt", "r").read()

class City:
    def __init__(self, data):
        data = data.split("\n")
        
        self.w = len(data[0])
        self.h = len(data)
    
        self.antinodes = []
        
        self.antennas = {}
        for y in range(self.h):
            for x in range(self.w):
                cell = data[y][x]
                if cell != ".":
                    if not cell in self.antennas:
                        self.antennas[cell] = []
                    self.antennas[cell].append((x, y))
        
        
    
    def calculate_all_antinodes(self, harmonics = False):
        for antenna_type in self.antennas:
            for p1 in self.antennas[antenna_type]:
                for p2 in self.antennas[antenna_type]:
                    if harmonics:
                        self.calculate_antinode_harmonics(p1, p2)
                    else:
                        self.calculate_antinode(p1, p2)
        return len(self.antinodes)
    
    def calculate_antinode(self, p1, p2):
        if p1 == p2: return
        
        d = (p1[0] - p2[0], p1[1] - p2[1])
        
        antinode1 = (p1[0] + d[0], p1[1] + d[1])
        antinode2 = (p2[0] - d[0], p2[1] - d[1])
        
        if antinode1[0] >= 0 and antinode1[0] < self.w and antinode1[1] >= 0 and antinode1[1] < self.h and not antinode1 in self.antinodes:
            self.antinodes.append(antinode1)
        if antinode2[0] >= 0 and antinode2[0] < self.w and antinode2[1] >= 0 and antinode2[1] < self.h and not antinode2 in self.antinodes:
            self.antinodes.append(antinode2)
    
    def calculate_antinode_harmonics(self, p1, p2):
        if p1 == p2: return
        
        if p2[0] > p1[0]:
            (p2, p1) = (p1, p2)
        
        d = (p1[0] - p2[0], p1[1] - p2[1])
        i = 0
        
        while p1[0] + d[0] * i >= 0 and p1[0] + d[0] * i < self.w and p1[1] + d[1] * i >= 0 and p1[1] + d[1] * i < self.h:
            i -= 1
        i += 1
        
        while True:
            antinode = (p1[0] + d[0] * i, p1[1] + d[1] * i)
            if not (antinode[0] >= 0 and antinode[0] < self.w and antinode[1] >= 0 and antinode[1] < self.h):
                break
            if not antinode in self.antinodes:
                self.antinodes.append(antinode)
            i += 1

def puzzle_1(data):
    city = City(data)
    return city.calculate_all_antinodes(False)

def puzzle_2(data):
    city = City(data)
    
    return city.calculate_all_antinodes(True)

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))