"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input13.txt", "r").read()

class Line:
    def __init__(self, slope, intercept):
        self.slope = slope
        self.intercept = intercept
    
    @staticmethod
    def intersect(self, other):
        intersect_x = (self.intercept - other.intercept) / (other.slope - self.slope)
        intersect_y = self.slope * intersect_x + self.intercept
        return (intersect_x, intersect_y)

ERROR_MARGIN = 0.001
def acceptable(num):
    return abs(round(num) - num) < ERROR_MARGIN

A_COST = 3
B_COST = 1

def solve(data, prize_modifier):
    data = data.split("\n\n")
    
    total = 0
    for machine in data:
        lines = machine.split("\n")
        button_a = (int(lines[0][lines[0].index("X+")+2:lines[0].index(",")]), int(lines[0][lines[0].index("Y+")+2:]))
        button_b = (int(lines[1][lines[1].index("X+")+2:lines[1].index(",")]), int(lines[1][lines[1].index("Y+")+2:]))
        prize = (int(lines[2][lines[2].index("X=")+2:lines[2].index(",")]) + prize_modifier, int(lines[2][lines[2].index("Y=")+2:]) + prize_modifier)
        
        l1 = Line(-button_a[0] / button_b[0], prize[0] / button_b[0])
        l2 = Line(-button_a[1] / button_b[1], prize[1] / button_b[1])
        
        p = Line.intersect(l1, l2)
        if acceptable(p[0]) and acceptable(p[1]):
            total += round(p[0]) * A_COST + round(p[1]) * B_COST
    
    return total

def puzzle_1(data):
    return solve(data, 0)

def puzzle_2(data):
    return solve(data, 10000000000000)

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))