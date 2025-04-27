"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input22.txt", "r").read()

class Buyer:
    PRUNE_CONST = 16777216
    
    def __init__(self, secret_number):
        self.secret_number = secret_number
    
    def next(self):
        self.secret_number = (self.secret_number ^ (self.secret_number * 64)) % Buyer.PRUNE_CONST
        self.secret_number = (self.secret_number ^ (self.secret_number // 32)) % Buyer.PRUNE_CONST
        self.secret_number = (self.secret_number ^ (self.secret_number * 2048)) % Buyer.PRUNE_CONST
    
    def price(self):
        return str(self.secret_number)[-1]
    
    @staticmethod
    def mix(secret_number, num):
        return secret_number ^ num
    
    @staticmethod
    def prune(secret_number):
        return secret_number % 16777216

def puzzle_1(data):
    data = map(int, data.split("\n"))
    
    total = 0
    for start_num in data:
        b = Buyer(start_num)
        for i in range(2000):
            b.next()
        total += b.secret_number
    
    return total

def puzzle_2(data):
    total = 0
    return total

print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))