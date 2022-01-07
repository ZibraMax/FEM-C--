import numpy as np
import matplotlib.pyplot as plt
import triangle as tr

A = dict(vertices=np.array(((0, 0), (1, 0), (1, 1), (0, 1))))
B = tr.triangulate(A, 'qa0.1')
nodes = B['vertices']  # coordenadas
triangles = B['triangles']  # empieza en 0
piramides = []
n = len(nodes)

print(triangles)

m = 2
h = 1.0

dz = h/(m-1)

dddnodes = np.zeros([m*n, 3])
for i in range(m):
    dddnodes[n*(i):n*(i+1), :2] = nodes
    dddnodes[n*(i):n*(i+1), -1] = i*dz

for i in range(m-1):
    for t in triangles:
        t = np.array(t)
        nodossup = n*(i) + t
        nodosinf = n*(i+1) + t
        p = nodossup.tolist()+nodosinf.tolist()

        piramides += [[p[2], p[5], p[0], p[1]]]
        piramides += [[p[0], p[5], p[3], p[4]]]
        piramides += [[p[0], p[5], p[4], p[1]]]

dictionary = {"coords": dddnodes.tolist(), "prisms": piramides}

with open('geometry.json', 'w') as f:
    f.write(format(dictionary).replace("'", '"'))
