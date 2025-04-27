class Bitboard:
    def __init__(self, w: int, h: int):
        self.w = w
        self.h = h
        self.data = [0 for y in range(h)]
    
    def in_bounds(self, x, y):
        if x < 0 or x >= self.w:
            raise IndexError(f"{x} was outside of the bounds of {self.__repr__()} (0 < x < {self.w})")
        if y < 0 or y >= self.h:
            raise IndexError(f"{y} was outside of the bounds of {self.__repr__()} (0 < y < {self.h})")

    def get(self, x: int, y: int) -> bool:
        self.in_bounds(x, y)
        return (self.data[y] >> x) & 1 == 1

    def set(self, x: int, y: int, value: bool):
        self.in_bounds(x, y)
        self.data[y] = (self.data[y] & ~(value << x)) | (value << x)
    
    def __str__(self):
        s = ""
        for line in self.data:
            binary = "{0:b}".format(line)
            s += ("0" * (self.w - len(binary)) + binary)[::-1] + "\n"
        return s
    
    def can_bitwise(self, other):
        if self.w != other.w or self.h != other.h:
            raise IndexError(f"Cannot perform bit operations on {self.__repr__()} and {other.__repr__()}: unmatched width or height")
    
    def __and__(self, other):
        self.can_bitwise(other)
        new = Bitboard(self.w, self.h)
        for i in range(self.h):
            new.data[i] = self.data[i] & other.data[i]
        return new
        
    def __or__(self, other):
        self.can_bitwise(other)
        new = Bitboard(self.w, self.h)
        for i in range(self.h):
            new.data[i] = self.data[i] | other.data[i]
        return new
    
    def __xor__(self, other):
        self.can_bitwise(other)
        new = Bitboard(self.w, self.h)
        for i in range(self.h):
            new.data[i] = self.data[i] ^ other.data[i]
        return new
    
    def __eq__(self, other):
        self.can_bitwise(other)
        for i in range(self.h):
            if self.data[i] != other.data[i]:
                return False
        return True