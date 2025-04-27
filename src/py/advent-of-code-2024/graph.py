from bitboard import Bitboard

class Graph:
    def __init__(self, nodes):
        self.nodes = nodes
        self.edge_matrix = Bitboard(len(nodes), len(nodes))
    
    def add_directional_edge(self, node_from, node_to):
        self.edge_matrix.set(self.nodes.index(node_from), self.nodes.index(node_to), True)

    def add_bidirectional_edge(self, node1, node2):
        self.edge_matrix.set(self.nodes.index(node1), self.nodes.index(node2), True)
        self.edge_matrix.set(self.nodes.index(node2), self.nodes.index(node1), True)
    
    def has_edge(self, node_from, node_to) -> bool:
        return self.edge_matrix.get(self.nodes.index(node_from), self.nodes.index(node_to))
    
    def depth_first_search(self, match_fn, start = 0):
        solutions = []
        
        stack = [{"node" : start, "search_index" : 0}]
        
        while True:
            current = stack[-1]
            
            if match_fn(self.nodes[current["node"]]):
                solutions.append([self.nodes[item["node"]] for item in stack])
                stack.pop()
                
                current = stack[-1]
                current["search_index"] += 1
                while current["search_index"] >= len(self.nodes):
                    stack.pop()
                    if len(stack) == 0:
                        return solutions
                    else:
                        current = stack[-1]
                        current["search_index"] += 1
                continue
                
            if self.edge_matrix.get(self.nodes.index(self.nodes[current["node"]]), current["search_index"]):
                stack.append({"node" : current["search_index"], "search_index" : 0})
                continue
            
            current["search_index"] += 1
            while current["search_index"] >= len(self.nodes):
                stack.pop()
                if len(stack) == 0:
                    return solutions
                else:
                    current = stack[-1]
                    current["search_index"] += 1
         
        return solutions

if __name__ == "__main__":
    g = Graph(["a", "b", "c"])
    g.add_directional_edge("a", "b")
    g.add_bidirectional_edge("b", "c")
    g.add_directional_edge("a", "c")
    
    print(g.depth_first_search(lambda x: x == "b"))