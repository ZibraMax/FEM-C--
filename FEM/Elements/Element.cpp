#include "Element.h"

namespace FEM
{

	Element::Element(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, bool border)
	{
		this->m = coords.size();
		this->n = coords[0].size();

		Eigen::MatrixXd coordsp(this->m, this->n);
		for (int i = 0; i < this->m; i++)
		{
			for (int j = 0; j < this->n; j++)
			{
				coordsp(i, j) = coords[i][j];
			}
		}

		this->coords = coordsp;
		this->gdl = gdl;
		this->border = border;

		this->properties = "";
		this->borderIntegrals = false;
		if (!border)
		{
			this->matrixVectorzToZeros();
		}
	}

	void Element::matrixVectorzToZeros()
	{
		int n = this->n;
		this->Ke = Eigen::MatrixXd::Zero(n, n);
		this->Qe = Eigen::VectorXd::Zero(n);
		this->Fe = Eigen::VectorXd::Zero(n);
		this->Ue = Eigen::VectorXd::Zero(n);
	}

	Eigen::MatrixXd Element::T(Eigen::MatrixXd z)
	{
		return psis(z) * this->coords;
	}
	std::vector<Eigen::MatrixXd> Element::J(Eigen::MatrixXd z)
	{
		std::vector<Eigen::MatrixXd> dpsis = this->dpsis(z);
		std::vector<Eigen::MatrixXd> result;
		for (int i = 0; i < dpsis.size(); i++)
		{
			result.push_back(dpsis[i] * this->coords);
		}

		return result;
	}

	Eigen::MatrixXd Element::inverseMapping(Eigen::MatrixXd x, int n)
	{
		return x;
	}

	Eigen::MatrixXd Element::psis(Eigen::MatrixXd z)
	{
		return {};
	}

	std::vector<Eigen::MatrixXd> Element::dpsis(Eigen::MatrixXd z)
	{
		return {};
	}

} // namespace FEM
