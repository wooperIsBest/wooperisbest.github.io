"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

from graph import *
from grid import *

data = open("input16.txt", "r").read()

def puzzle_1(data):
    data = data.split("\n")
    
    maze = Grid(data)
    
    start = maze.index_depth_first("S")
    end = maze.index_depth_first("E")

    maze.replace_all("S", ".").replace_all("E", ".")
    
    print(maze)
    
    graph_nodes = []
    for y in range(maze.h):
        for x in range(maze.w):
            if maze.get(Point(x, y)) == ".":
                graph_nodes.append(Point(x, y))
    
    graph = Graph(graph_nodes)
    
    for node in graph_nodes:
        for direction in DIRECTIONS.values():
            if maze.get_safe(node + direction) == ".":
                graph.add_bidirectional_edge(node, node + direction)
    
    print(graph.depth_first_search(lambda p: p == end, graph.nodes.index(start)))
    
                
    
    total = 0
    return total

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))