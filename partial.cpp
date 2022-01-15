#include <iostream>
#include "FEM/Utils/Utils.h"

int main(int argc, char const *argv[])
{
	int n = 3;
	Utils::GaussLegendre gl = Utils::GaussLegendre(n);
	for (int i = 0; i < n; i++)
	{
		std::cout << gl.z[i] << "," << gl.w[i] << std::endl;
	}

	return 0;
}
