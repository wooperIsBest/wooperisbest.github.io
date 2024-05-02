import math

CONSTANTS = {
    "pi" : 3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342,
    "e" :  2.718281828459045235360287471352662497757247093699959574966967627724076630353594571382178525166,
    "ans" : 0
}
OPERATORS_3 = ["+", "-", "*", "/", "^", "%", "(", ")"]
OPERATORS_2 = ["sqrt", "sin", "cos", "tan", "csc", "sec", "cot" "asin", "acos", "atan", "pi", "e", "ans"]
def lexer(expr): #Lexes the expression into numbers and operators
    new_list = []
    new_list_index = 0
    i = 0
    toggle_close_on_next_num = False
    close_on_next_num = False
    while i < len(expr):
        char = expr[i]
        if char in OPERATORS_3 and len(new_list) > new_list_index:
            new_list_index += 1
        is_op_2 = False
        for op in OPERATORS_2:
            if char == op[0]:
                if expr[i:i+len(op)] == op:
                    new_list.append(op)
                    new_list_index += 1
                    i += len(op) - 1
                    is_op_2 = True
        if not is_op_2:
            if new_list_index >= len(new_list):
                if close_on_next_num:
                    new_list.append(")")
                    toggle_close_on_next_num = False
                    close_on_next_num = False
                    new_list_index += 1
                if toggle_close_on_next_num:
                    close_on_next_num = True
                if char == "-" and (expr[i-1] in OPERATORS_3 or expr[i-1] in OPERATORS_2 or i == 0):
                    new_list.append("(")
                    new_list.append("0")
                    new_list_index += 2
                    toggle_close_on_next_num = True
                new_list.append(char)
                
            else:
                new_list[new_list_index] += char
        if char in OPERATORS_3:
            new_list_index += 1
        i += 1
        
    if close_on_next_num:
        new_list.append(")")
    
    return new_list

def sort_to_operations(expr): #Recursively sorts the list into operations
    can_remove_parenthesis = True
    while can_remove_parenthesis:
        can_remove_parenthesis = False
        if expr[0] == "(":
            parentheses = 0
            for i in range(len(expr)):
                char = expr[i]
                if char == "(":
                    parentheses += 1
                if char == ")":
                    parentheses -= 1
                    if parentheses == 0:
                        if i == len(expr) - 1:
                            can_remove_parenthesis = True
                        else:
                            break
        if can_remove_parenthesis:
            expr = expr[1:-1]
    for ops in [["+", "-"], ["*", "/", "%"], ["^", "sqrt"], ["sin", "cos", "tan", "csc", "sec", "cot"], ["(", ")"]]: #Order of operations
        parentheses = 0
        for i in range(len(expr) - 1, -1, -1):
            char = expr[i]
            if expr[i] == ")":
                parentheses += 1
            elif expr[i] == "(":
                parentheses -= 1
            if char in ops and parentheses == 0:
                if char in OPERATORS_3:
                    return [sort_to_operations(expr[:i]), char, sort_to_operations(expr[i+1:])]
                if char in OPERATORS_2:
                    return [char, sort_to_operations(expr[i+1:])]
    return expr[0] #If the expression is not an operation (just a number), return the number

def calculate(expr): #Recursively calculates each operation
    if len(expr) != 1:
        if expr[1] == "+":
            return calculate(expr[0]) + calculate(expr[2])
        elif expr[1] == "-":
            return calculate(expr[0]) - calculate(expr[2])
        elif expr[1] == "*":
            return calculate(expr[0]) * calculate(expr[2])
        elif expr[1] == "/":
            return calculate(expr[0]) / calculate(expr[2])
        elif expr[1] == "^":
            return calculate(expr[0]) ** calculate(expr[2])
        elif expr[1] == "%":
            return calculate(expr[0]) % calculate(expr[2])
        elif expr[0] == "sqrt":
            return math.sqrt(calculate(expr[1]))
        elif expr[0] == "sin":
            return math.sin(math.radians(calculate(expr[1])))
        elif expr[0] == "cos":
            return math.cos(math.radians(calculate(expr[1])))
        elif expr[0] == "tan":
            return math.tan(math.radians(calculate(expr[1])))
        elif expr[0] == "csc":
            return 1 / math.sin(math.radians(calculate(expr[1])))
        elif expr[0] == "sec":
            return 1 / math.cos(math.radians(calculate(expr[1])))
        elif expr[0] == "cot":
            return 1 / math.tan(math.radians(calculate(expr[1])))
        elif expr[0] == "asin":
            return math.degrees(math.asin(calculate(expr[1])))
        elif expr[0] == "acos":
            return math.degrees(math.acos(calculate(expr[1])))
        elif expr[0] == "atan":
            return math.degrees(math.atan(calculate(expr[1])))
    if expr in CONSTANTS:
        return CONSTANTS[expr]
    else:
        return float(expr)

while True:
    expr = input()
    if expr.lower() == "kill":
        break
    try: CONSTANTS["ans"] = calculate(sort_to_operations(lexer(expr))); print(CONSTANTS["ans"]); print()
    except: print("ERROR")
