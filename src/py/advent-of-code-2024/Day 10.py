"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input10.txt", "r").read()

def parse(data):
    return [[int(x) for x in y] for y in data.split("\n")]

def find_trailheads(data, trailhead):
    trailheads = []
    for row in range(len(data)):
        for col in range(len(data)):
            if data[row][col] == trailhead:
                trailheads.append((col, row))
    return trailheads

def trailhead_score(data, x, y, height):
    if not(y >= 0 and y < len(data) and x >= 0 and x < len(data[y])): return []
    if data[y][x] != height: return []
    if data[y][x] == 9: return [(x, y)]

    total_trails = []
    total_trails.extend(trailhead_score(data, x + 1, y, height + 1))
    total_trails.extend(trailhead_score(data, x - 1, y, height + 1))
    total_trails.extend(trailhead_score(data, x, y + 1, height + 1))
    total_trails.extend(trailhead_score(data, x, y - 1, height + 1))
    return total_trails

def next_slope(data, x, y, height):
    if not(y >= 0 and y < len(data) and x >= 0 and x < len(data[y])): return 0
    if data[y][x] != height: return 0
    if data[y][x] == 9: return 1

    total_trails = 0
    total_trails += next_slope(data, x + 1, y, height + 1)
    total_trails += next_slope(data, x - 1, y, height + 1)
    total_trails += next_slope(data, x, y + 1, height + 1)
    total_trails += next_slope(data, x, y - 1, height + 1)
    print("\t" * height, height, "at", x, y, "has", total_trails, "trails")
    return total_trails

def puzzle_1(data):
    data = parse(data)
    trailheads = find_trailheads(data, 0)
    
    return sum([len(set(trailhead_score(data, trailhead[0], trailhead[1], 0))) for trailhead in trailheads])

def puzzle_2(data):
    data = parse(data)
    trailheads = find_trailheads(data, 0)
    
    return sum([len(trailhead_score(data, trailhead[0], trailhead[1], 0)) for trailhead in trailheads])

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))