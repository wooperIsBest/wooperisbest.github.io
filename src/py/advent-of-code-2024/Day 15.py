"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input15.txt", "r").read()

def parse(data):
    data = data.split("\n\n")
    map = data[0].split("\n")
    directions = data[1].replace("\n", "")
    return (map, directions)

def str_replace(string, new_string, index):
    return string[:index] + new_string + string[index+1:]

def move(map, robot_pos, dx, dy):
    old_map = map.copy()
    
    i = 1
    can_move = False
    while map[robot_pos[1] + dy * i][robot_pos[0] + dx * i] != "#":
        if map[robot_pos[1] + dy * i][robot_pos[0] + dx * i] == ".":
            can_move = (robot_pos[0] + dx * i, robot_pos[1] + dy * i)
            break
        i += 1
    
    if can_move:
        map[robot_pos[1]] = str_replace(map[robot_pos[1]], ".", robot_pos[0])
        robot_pos[0] += dx
        robot_pos[1] += dy
        
        if map[robot_pos[1]][robot_pos[0]] == "O":
            map[can_move[1]] = str_replace(map[can_move[1]], "O", can_move[0])
        
        map[robot_pos[1]] = str_replace(map[robot_pos[1]], "@", robot_pos[0])
        
        return (robot_pos, map)
    else:
        return (robot_pos, old_map)

def puzzle_1(data):
    (map, directions) = data
    
    robot_pos = []
    for row in range(len(map)):
        for col in range(len(map)):
            if map[row][col] == "@":
                robot_pos = [col, row]
    
    #Movements
    for dir in directions:
        match dir:
            case "<":
                (robot_pos, map) = move(map, robot_pos, -1, 0)
            case "^":
                (robot_pos, map) = move(map, robot_pos, 0, -1)
            case ">":
                (robot_pos, map) = move(map, robot_pos, 1, 0)
            case "v":
                (robot_pos, map) = move(map, robot_pos, 0, 1)
    
    #GPS Score
    total = 0
    for row in range(len(map)):
        for col in range(len(map)):
            if map[row][col] == "O":
                total += 100 * row + col
    return total

def puzzle_2(data):
    (map, directions) = data
    
    map = "\n".join(map)
    map = map.replace("#", "##").replace("O", "[]").replace(".", "..").replace("@", "@.")
    
    print((map))
    
    return total

print("Puzzle 1 Solution:", puzzle_1(parse(data)))
print("Puzzle 2 Solution:", puzzle_2(parse(data)))