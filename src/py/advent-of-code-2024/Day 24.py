"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

GATE_VALUE = {
    "False" : 0,
    "True" : 1,
    "Indeterminate" : 2
}

data = open("input24.txt", "r").read()

def parse(data):
    data = data.split("\n\n")
    
    wires = {}
    for line in data[0].split("\n"):
        wires[line[:3]] = int(line[-1])
    
    gates = []
    for line in data[1].split("\n"):
        line = line.split(" ")
        gates.append({"in1" : line[0], "in2" : line[2], "op" : line[1], "out" : line[4]})
    
    for gate in gates:
        for wire in ["in1", "in2", "out"]:
            if not gate[wire] in wires:
                wires[gate[wire]] = GATE_VALUE["Indeterminate"]
    
    return wires, gates

def puzzle_1(data):
    wires, gates = parse(data)
    
    while True:
        if len(gates) == 0:
            break
        
        in1, in2, op, out = gates[0].values()
        
        if wires[in1] == GATE_VALUE["Indeterminate"] or wires[in2] == GATE_VALUE["Indeterminate"]:
            gates.append(gates.pop(0))
            continue
        
        match op:
            case "AND":
                wires[out] = wires[in1] & wires[in2]
            case "OR":
                wires[out] = wires[in1] | wires[in2]
            case "XOR":
                wires[out] = wires[in1] ^ wires[in2]
        
        gates.pop(0)
        
    wire_keys = list(wires.keys())
    wire_keys.sort()
    wire_keys = wire_keys[wire_keys.index("z00"):]
    
    total = 0
    for i in range(len(wire_keys)):
        total += wires[wire_keys[i]] << i
    
    return total

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))