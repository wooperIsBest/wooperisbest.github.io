"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input2.txt", "r").read()

def sign(num):
	if num == 0: return 0
	return num / abs(num)

def is_safe(sequence):
	change = sign(sequence[1] - sequence[0])

	for i in range(1, len(sequence)):
		diff = sequence[i] - sequence[i - 1]
		if abs(diff) < 1 or abs(diff) > 3 or sign(diff) != change:
			return False
	return True

def problem_dampener(sequence):
	possibilities = []
	for i in range(len(sequence)):
		possibility = sequence.copy()
		possibility.pop(i)
		possibilities.append(possibility)
	return possibilities


def puzzle_1(data):
    data = data.split("\n")
    
    total = 0
    for line in data:
        sequence = list(map(int, line.split()))
        
        if is_safe(sequence):
            total += 1
    return total
    
def puzzle_2(data):
    data = data.split("\n")
    total = 0

    for line in data:
        sequence = list(map(int, line.split()))
        
        for possibility in problem_dampener(sequence):
            if is_safe(possibility):
                total += 1
                break
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))