#ifndef RECTANGULAR_SCHEME_H
#define RECTANGULAR_SCHEME_H

#include "Element2D.h"
#include "Utils.h"

#include <vector>

namespace FEM
{
	class RectangularScheme : public Element2D
	{
	public:
		RectangularScheme(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, int n);
	};

}

#endif