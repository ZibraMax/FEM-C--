#include "Element2D.h"

namespace FEM
{

	Element2D::Element2D(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: Element(coords, gdl)
	{
	}

	bool Element2D::isInside(Eigen::MatrixXd x)
	{
		return true;
	}

} // namespace FEM
