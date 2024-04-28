def int_input(val):
    num = None
    while(not isinstance(type(num), int)):
        num = input(val)
        try:
            return int(num)
        except:
            print("That is not a valid integer!")
            num = None

def float_input(val):
    num = None
    while(not isinstance(type(num), float)):
        num = input(val)
        try:
            return float(num)
        except:
            print("That is not a valid floating-point number!")
            num = None
            
def choice(question, choices, case_sensitive = False):
    output = None
    while(not output in choices):
        if case_sensitive:
            output = input(question)
        else:
            output = input(question).lower()
        if not output in choices:
            print("That is not a valid choice!")
    return output