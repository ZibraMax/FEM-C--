#ifndef ELEMENT2D_H
#define ELEMENT2D_H
#include "Element.h"
#include <vector>

namespace FEM
{

	class Element2D : public Element
	{
	public:
		Element2D(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl);
		bool isInside(Eigen::MatrixXd &x);
	};

} // namespace FEM
#endif