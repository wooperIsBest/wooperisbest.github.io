"""
To Do:
fix when the data is a comma
add more than 26 columns
"""

import traceback
import copy

try:
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def render_csv(old_data):
        data = copy.deepcopy(old_data)
        
        col_widths = []
        for row in range(len(data)):
            row_data = data[row]
            row_data.insert(0, str(row))
            
            for col in range(len(row_data)):
                if len(col_widths) < col + 1:
                    col_widths.append(0)
                if len(row_data[col]) > col_widths[col]:
                    col_widths[col] = len(row_data[col])
        
        data.insert(0, [""] + list(ALPHABET[:len(col_widths) - 1]))
        
        for row in range(len(data)):
            row_data = data[row]
            row_string = ""
            for col in range(len(row_data)):
                row_data[col] += " " * (col_widths[col] - len(row_data[col]) + 2)
                row_string += row_data[col]
            print(" " + row_string)

    def csv_to_list(data):
        data = data.split("\n")
        for row in range(len(data)):
            data[row] = data[row].split(",")
        return data
    
    def list_to_csv(data):
        for row in range(len(data)):
            data[row] = ",".join(data[row])
        data = "\n".join(data)
        return data

    filename = input("Comma Separated Value filename: ")
    file_data = open(filename).read()
    
    data = csv_to_list(file_data)
    render_csv(data)
    
    print()
    while True:
        op = input("Operation: (EDIT, SAVE, RENDER) ").lower()
        if op == "edit":
            row = int(input("\nRow number: "))
            col = int(input("Column number: "))
            val = input("New value: ")
            
            data[row][col] = val
        if op == "render":
            print()
            render_csv(data)
        if op == "save":
            w = open(filename, "w")
            w.write(list_to_csv(data))
            w.close()
except Exception as e:
    traceback.print_exc()
    input()