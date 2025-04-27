"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input19.txt", "r").read()

def puzzle_1(data):
    data = data.split("\n")
    available = data[0].split(", ")
    designs = data[2:]
    
    available.sort(key=len, reverse=True)
    
    print(available)
    print(designs)
    
    total = 0
    for design in designs:
        stack = []
        design_ptr = 0
        
        can_solve = False
        
        stack.append(0)
        while True:
            try_towel = available[stack[-1]]
            if design[design_ptr : design_ptr + len(try_towel)] == try_towel:
                design_ptr += len(try_towel)
                if design_ptr == len(design):
                    print("Found a way!")
                    assert "".join([available[i] for i in stack]) == design
                    
                    total += 1
                    break
                
                stack.append(0)
                continue
                
            
            stack[-1] += 1
            if stack[-1] == len(available):
                stack.pop()
                if len(stack) == 0:
                    print("Couldn't find a way :(", stack)
                    break
    
    return total

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))