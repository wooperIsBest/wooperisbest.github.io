"""
<RunNpp>
	tag StayOpen
</RunNpp>
"""

data = open("input9.txt", "r").read()

def disk_map_to_blocks(disk_map):
    blocks = []
    for i in range(len(disk_map)):
        if i % 2 == 0:
            for j in range(int(disk_map[i])):
                blocks.append(i // 2)
        else:
            for j in range(int(disk_map[i])):
                blocks.append(".")
    return blocks

def compact(blocks):
    while "." in blocks:
        if blocks[-1] == ".":
            blocks = blocks[:-1]
        else:
            blocks[blocks.index(".")] = blocks[-1]
            blocks = blocks[:-1]
    return blocks

def first_empty_of_size(blocks, size):
    i = 0
    while i < len(blocks):
        if blocks[i] == ".":
            length = 1
            while i + length < len(blocks) and blocks[i + length] == ".":
                length += 1
            if i + length == len(blocks):
                length += 1
            if length >= size:
                return i
            i += length
        i += 1
    return -1


def compact_unfragmented(blocks):
    i = 0
    file_lengths = {}
    while i < len(blocks):
        if blocks[i] != ".":
            file_length = 0
            while i + file_length < len(blocks) and blocks[i + file_length] == blocks[i]:
                file_length += 1
            if i + file_length == len(blocks):
                file_length += 1
            file_lengths[blocks[i]] = file_length
            i += file_length
        i += 1
    
    for file in list(reversed([key for key in file_lengths.keys()])):
        push_index = first_empty_of_size(blocks, file_lengths[file])
        pull_index = blocks.index(file)
        if push_index > -1 and push_index < pull_index:
            #print("big enough block for", file_lengths[file], file, "s at", first_empty_of_size(blocks, file_lengths[file]))

            blocks[pull_index:pull_index+file_lengths[file]] = ["." for i in range(file_lengths[file])]
            blocks[push_index:push_index+file_lengths[file]] = [file for i in range(file_lengths[file])]
        
    return blocks

def checksum(blocks):
    total = 0
    for i in range(len(blocks)):
        if type(blocks[i]) == type(1):
            total += i * blocks[i]
    return total

def puzzle_1(data):
    blocks = disk_map_to_blocks(data)
    compacted = compact(blocks)
    print(compacted)
    sum = checksum(compacted)
    return sum

def puzzle_2(data):
    blocks = disk_map_to_blocks(data)
    for b in (blocks):
        print(b)

    compacted = compact_unfragmented(blocks)
    for c in compacted:
        print(c)

    sum = checksum(compacted)
    print(sum)

    return sum

#print("Puzzle 1 Solution:", puzzle_1(data))
print("Puzzle 2 Solution:", puzzle_2(data))