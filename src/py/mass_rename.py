import os

name = input("What would you like the files to be renamed to? (A number will be placed at the end) ")
os.chdir(os.path.dirname(os.path.realpath(__file__)))
files = (os.listdir(os.path.dirname(os.path.realpath(__file__))))

for i in range(len(files)):
    if(files[i] != os.path.basename(__file__)):
        print(files[i], "has been renamed to", name + str(i))
        fileType = files[i].split(".")[len(files[i].split(".")) - 1]
        os.rename(files[i], name + str(i) + "." + fileType)

input()