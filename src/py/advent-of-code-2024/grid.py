import math

class Point:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
    
    def __str__(self) -> str:
        return "(" + str(self.x) + ", " + str(self.y) + ")"
    
    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)
    
    def __iadd__(self, other):
        self.x += other.x
        self.y += other.y
        return self
    
    def __eq__(self, other) -> bool:
        return self.x == other.x and self.y == other.y

    def to_tuple(self) -> tuple[int, int]:
        return (self.x, self.y)
    
    @staticmethod
    def distance(p1, p2):
        return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)

DIRECTIONS = {
    "UP"    : Point(0, -1),
    "RIGHT" : Point(1, 0),
    "DOWN"  : Point(0, 1),
    "LEFT"  : Point(-1, 0)
}

#Grid helper class. Data is stored with (0, 0) being the top left and (w, h) being the bottom right.
class Grid:
    def __init__(self, w_or_data, h = None):
        if h == None:
            self.w = len(w_or_data[0])
            self.h = len(w_or_data)
            self._data = [[w_or_data[y][x] for x in range(self.w)] for y in range(self.h)]
        else:
            self.w = w_or_data
            self.h = h
            self._data = [[0 for x in range(w_or_data)] for y in range(h)]
    
    def load_data(self, data):
        for row in range(len(data)):
            if row >= self.h or row >= len(data): break
            for col in range(len(data)):
                if col >= self.w or col >= len(data[row]): break
                self._data[row][col] = data[row][col]
        return self

    def set(self, point, value):
        self._data[point.y][point.x] = value

    def get(self, point):
        return self._data[point.y][point.x]
        
    def get_safe(self, point):
        if point.x < 0 or point.x >= self.w or point.y < 0 or point.y >= self.h: return None 
        return self._data[point.y][point.x]

    def index_breadth_first(self, value) -> Point:
        for row in range(self.h):
            for col in range(self.w):
                if self._data[row][col] == value:
                    return Point(col, row)
    
    def index_depth_first(self, value) -> Point:
        for col in range(self.w):
            for row in range(self.h):
                if self._data[row][col] == value:
                    return Point(col, row)

    def replace_all(self, value, replace_value):
        for row in range(self.h):
            for col in range(self.w):
                if self._data[row][col] == value:
                    self._data[row][col] = replace_value
        return self

    def __str__(self) -> str:
        return "\n".join(["".join(map(str, self._data[y])) for y in range(self.h)])