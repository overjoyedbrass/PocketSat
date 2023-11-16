with open("src/data/observatories.txt", mode="r") as f:
    data = f.readlines()
    data.pop(0)
    data.pop()

cols = ["Pl", "code", "lng", "lat","alt", "rho_cos", "rho_sin_phi", "region"]
fun = [int, str, float, float, float, float, float, str, str]
with open("src/data/observatories.js", mode="w") as f:
    print("export const observatories = [", file=f)
    for row in data:
        rc = row.split()
        print("\t{", file=f, end="")
        for i in range(1, len(cols)):
            tik = '' if fun[i] != str else '"'
            print(f'{cols[i]}: {tik}{fun[i](rc[i])}{tik}, ', file=f, end="")
        print(f'"name": "{" ".join([*rc[len(cols):]])}"', file=f, end="")
        print("},", file=f)
    print("]\n", file=f)
        
