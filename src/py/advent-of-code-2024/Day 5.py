"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

import functools

data = open("input5.txt", "r").read()

class update_list:
    def __init__(self, updates):
        self.updates = updates
    
    def check_rule(self, rule):
        if not (rule[0] in self.updates and rule[1] in self.updates): return True
        return self.updates.index(rule[0]) < self.updates.index(rule[1])
    
    def check_rules(self, rules):
        for rule in rules:
            if not self.check_rule(rule):
                return False
        return True
    
    def compare(self, rules, a, b):
        for rule in rules:
            if rule[0] == a and rule[1] == b:
                return -1
        return 0

    def sort(self, rules):
        self.updates.sort(key=functools.cmp_to_key(lambda a,b: self.compare(rules, a,b)))

    def middle_page(self):
        return self.updates[len(self.updates) // 2]

def parse(data):
    data = data.split("\n")
    rules_data = data[:data.index("")]
    updates_data = data[data.index("") + 1:]

    rules = [[int(x) for x in rule.split("|")] for rule in rules_data]
    updates = [update_list([int(x) for x in update.split(",")]) for update in updates_data]
    
    return (rules, updates)

def puzzle_1(data):
    (rules, updates) = data

    total = 0
    for update in updates:
        if update.check_rules(rules):
            total += update.middle_page()
    return total

def puzzle_2(data):
    (rules, updates) = data

    total = 0
    for update in updates:
        if not update.check_rules(rules):
            update.sort(rules)
            total += update.middle_page()
    return total

print("Puzzle 1 Solution:", puzzle_1(parse(data)))
print("Puzzle 2 Solution:", puzzle_2(parse(data)))