"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

import re

data = open("input3.txt", "r").read()

def puzzle_1(data):
    matches = re.findall("mul\(\d+,\d+\)", data)

    total = 0
    for match in matches:
        match = re.sub("(mul\()|(\))", "", match)
        nums = match.split(",")
        total += int(nums[0]) * int(nums[1])
    return total

def puzzle_2(data):
    mul_matches = re.finditer("mul\(\d+,\d+\)", data)

    disabled_areas = []
    current_start = 0
    current_enabled = True
    i = 0
    while True:
        next_dont = data.find("don't()", i)
        next_do = data.find("do()", i)
        
        if next_dont == -1:
            disabled_areas.append((current_start, next_do))
            break
        
        if current_enabled:
            if next_dont < next_do:
                current_start = next_dont
                current_enabled = False
        else:
            if next_do < next_dont:
                disabled_areas.append((current_start, next_do))
                current_enabled = True
        
        i = max(min(next_dont, next_do), i) + 3

    total = 0
    for mul_match in mul_matches:
        skip = False

        mul_span = mul_match.span()
        for area in disabled_areas:
            if area[0] <= mul_span[0] and area[1] >= mul_span[1]:
                skip = True
        
        mul_str = re.sub("(mul\()|(\))", "", mul_match.group())
        if skip:
            continue
        else:
            nums = mul_str.split(",")
            total += int(nums[0]) * int(nums[1])
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))