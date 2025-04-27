"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""
DIRECTIONS = [(0, 1), (0, -1), (1, 0), (-1, 0)]

data = open("input12.txt", "r").read()

def find_areas(data):
    areas = []
    
    for y in range(len(data)):
        for x in range(len(data[y])):
            new_area = True
            for area in areas:
                if area["sign"] == data[y][x]:
                    for (dx, dy) in DIRECTIONS:
                        if (x + dx, y + dy) in area["positions"]:
                            area["positions"].append((x, y))
                            new_area = False
                            break
            if new_area:
                areas.append({"sign" : data[y][x], "positions" : [(x, y)]})
    
    for area in areas:
        for check_area in filter(lambda x: x["sign"] == area["sign"], areas):
            if check_area == area: continue
            
            for pos in area["positions"]:
                if pos in check_area["positions"]:
                    a = area["positions"].copy()
                    a.extend(check_area["positions"])
                    area["positions"] = list(set(a))
                    check_area["positions"] = []
                    break
    
    return areas

def perimeter(positions):
    total = 0
    
    for pos in positions:
        for (dx, dy) in DIRECTIONS:
            if not (pos[0] + dx, pos[1] + dy) in positions:
                total += 1
    return total

def puzzle_1(data):
    data = data.split("\n")
    
    areas = find_areas(data)
    
    for area in areas:
        print(area["sign"], area["positions"])
        #print("Region of", area["sign"], " has a =", len(area["positions"]), "p =",
        #    perimeter(area["positions"]), "price =", len(area["positions"]) * perimeter(area["positions"]))
    
    return sum([len(area["positions"]) * perimeter(area["positions"]) for area in areas])

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))