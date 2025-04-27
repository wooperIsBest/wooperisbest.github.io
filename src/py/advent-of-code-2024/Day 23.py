"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

from graph import *

data = open("input23.txt", "r").read()

def puzzle_1(data):
    data = data.split("\n")
    
    computers = set()
    for line in data:
        computers.add(line[0:2])
        computers.add(line[3:5])
    
    graph = Graph(list(computers))
    
    print(graph.nodes)
    for line in data:
        graph.add_bidirectional_edge(line[0:2], line[3:5])
        
    print(graph.edge_matrix)
    
    total = 0
    return total

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))