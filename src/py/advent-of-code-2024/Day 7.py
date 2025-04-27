"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input7.txt", "r").read()

class EquationSolver:
    OP_ADD = 1 << 0
    OP_MULT = 1 << 1
    OP_CONC = 1 << 2

    def __init__(self, numbers, result):
        self.numbers = numbers
        self.result = result

    def __repr__(self):
        return "EquationSolver(numbers=" + str(self.numbers) + ", result=" + str(self.result) + ")"

    def check_operations(self, current_total, pos, ops):
        if pos == len(self.numbers) - 1:
            return current_total == self.result
        
        if (ops & EquationSolver.OP_ADD) and self.check_operations(current_total + self.numbers[pos + 1], pos + 1, ops):
            return True
        if (ops & EquationSolver.OP_MULT) and self.check_operations(current_total * self.numbers[pos + 1], pos + 1, ops):
            return True
        if (ops & EquationSolver.OP_CONC) and self.check_operations(int(str(current_total) + str(self.numbers[pos + 1])), pos + 1, ops):
            return True
        
        return False

def parse(data):
    data = data.split("\n")

    equations = []
    for row in data:
        row = row.split(":")
        equations.append(EquationSolver([int(x) for x in row[1].split(" ")[1:]], int(row[0])))
    
    return equations

def puzzle_1(data):
    total = 0
    for eq in data:
        if eq.check_operations(eq.numbers[0], 0, EquationSolver.OP_ADD | EquationSolver.OP_MULT):
            total += eq.result
    
    return total

def puzzle_2(data):
    total = 0
    for eq in data:
        if eq.check_operations(eq.numbers[0], 0, EquationSolver.OP_ADD | EquationSolver.OP_MULT | EquationSolver.OP_CONC):
            total += eq.result
    
    return total

print("Puzzle 1 Solution:", puzzle_1(parse(data)))
print("Puzzle 2 Solution:", puzzle_2(parse(data)))