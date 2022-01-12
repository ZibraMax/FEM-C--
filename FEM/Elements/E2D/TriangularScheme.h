#ifndef TRIANGULAR_SCHEME_H
#define TRIANGULAR_SCHEME_H
#include "Element2D.h"
#include <vector>

namespace FEM
{
	class TriangularScheme : public Element2D
	{
	public:
		TriangularScheme(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl);
	};

}
#endif