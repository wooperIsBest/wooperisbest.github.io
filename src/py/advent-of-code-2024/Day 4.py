"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input4.txt", "r").read()

def is_safe_index(data, i):
    return i < len(data) and i >= 0

def check_xmas(data, x, y, dx, dy):
    match_str = "XMAS"
    for i in range(len(match_str)):
        if is_safe_index(data, y + dy * i) and is_safe_index(data[y + dy * i], x + dx * i):
            if data[y + dy * i][x + dx * i] != match_str[i]:
                return False
        else:
            return False
    return True

def check_all_dirs(data, x, y):
    matches = 0
    for dx in range(-1, 2):
        for dy in range(-1, 2):
            if check_xmas(data, x, y, dx, dy):
                matches += 1

    return matches

def check_X_mas(data, x, y):
    if not is_safe_index(data, y - 1) or not is_safe_index(data, y + 1) or not is_safe_index(data[0], x - 1) or not is_safe_index(data[0], x + 1):
        return False
    side1 = "".join([data[y + i][x + i] for i in range(-1, 2)])
    side2 = "".join([data[y - i][x + i] for i in range(-1, 2)])

    correct_answers = ["MAS", "SAM"]
    if side1 in correct_answers and side2 in correct_answers:
        return True

def puzzle_1(data):
    data = data.split("\n")

    total = 0
    for row in range(len(data)):
        for col in range(len(data[row])):
            if data[row][col] == "X":
                total += check_all_dirs(data, col, row)
    return total

def puzzle_2(data):
    data = data.split("\n")

    total = 0
    for row in range(len(data)):
        for col in range(len(data[row])):
            if data[row][col] == "A":
                if check_X_mas(data, col, row):
                    total += 1
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))