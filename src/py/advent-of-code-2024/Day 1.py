"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input1.txt", "r").read()

def parse(data):
    data = data.split("\n")
    col1 = []
    col2 = []
    for line in data:
        line = line.split()
        col1.append(int(line[0]))
        col2.append(int(line[1]))
    return (col1, col2)

def puzzle_1(data):
    (col1, col2) = data
    
    total = 0
    while(len(col1) > 0):
        min1 = min(col1)
        min2 = min(col2)
        col1.remove(min1)
        col2.remove(min2)
        total += abs(min1 - min2)
    
    return total

def puzzle_2(data):
    (col1, col2) = data
    
    total = 0
    for value1 in col1:
        count = 0
        for value2 in col2:
            if value2 == value1:
                count += 1
        total += count * value1
    
    return total

print("Puzzle 1 Solution:", puzzle_1(parse(data)))
print("Puzzle 2 Solution:", puzzle_2(parse(data)))