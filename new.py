import sys
import os

def decapitalize(s):
    return ''.join([s[:1].lower(), s[1:]])

def capitalize(s):
    return ''.join([s[:1].upper(), s[1:]])

options = ["component", "page"]

def generateFile(tpe, name):
    if(tpe not in options):
        raise ValueError("Unknown type option")
    name = decapitalize(name)
    parentFolder = decapitalize(tpe+"s")
    parentDir = os.getcwd()

    path = os.path.join(os.path.join(parentDir, "src"), parentFolder)
    try:
        os.mkdir(path)
    except FileExistsError:
        pass
    
    try:
        newFolder = os.path.join(path, name)
        os.mkdir(newFolder)
        with open(os.path.join(newFolder, name+".js"), mode="w") as f:
            f.write(f"""import React from "react";
            
export const {capitalize(name)} = () => """ +"""{
    return null;
}""")
        with open(os.path.join(newFolder, "index.js"), mode="w") as f:
            f.write("export { "+ capitalize(name) +" } "+ f"from \"./{name}\";\n")
    except FileExistsError:
        pass    

    with open(os.path.join(path, "index.js"), mode="a") as f:
        f.write(f"\nexport * from \"./{name}\";")




def main():
    try:
        option = int(input("0: component\n1: page\nyour option: "))
        tpe = options[option]
    except ValueError:
        raise SyntaxError("Enter 0 or 1")
    name = input(f"\nEnter {options[option]} name: ")

    generateFile(tpe, name)
    print(options[option].capitalize(), name, "generated.")

if __name__ == "__main__":
   main()