#include "Element.h"

namespace FEM
{

	Element::Element(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, bool border)
	{
		this->m = coords.size();
		this->n = coords[0].size();
		this->k = gdl.size();

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
		int n = this->n * this->k;
		this->Ke = Eigen::MatrixXd::Zero(n, n);
		this->Qe = Eigen::VectorXd::Zero(n);
		this->Fe = Eigen::VectorXd::Zero(n);
		this->Ue = Eigen::VectorXd::Zero(n);
	}

	Eigen::MatrixXd Element::T(Eigen::MatrixXd &z)
	{
		return this->coords * psis(z);
	}

	std::vector<Eigen::MatrixXd> Element::J(Eigen::MatrixXd &z)
	{
		std::vector<Eigen::MatrixXd> dpsis = this->dpsis(z);
		std::vector<Eigen::MatrixXd> result;
		for (int i = 0; i < dpsis.size(); i++)
		{
			result.push_back((this->coords * dpsis[i]).transpose());
		}

		return result;
	}

	Eigen::MatrixXd Element::inverseMapping(Eigen::MatrixXd x, int n)
	{
		return x;
	}

	Eigen::MatrixXd Element::psis(Eigen::MatrixXd &z)
	{
		return {};
	}

	std::vector<Eigen::MatrixXd> Element::dpsis(Eigen::MatrixXd &z)
	{
		return {};
	}

	Eigen::MatrixXd Element::giveSolution(Eigen::MatrixXd &z)
	{
		return this->Ue * this->psis(z);
	}

	void Element::setUe(Eigen::VectorXd &U)
	{
		// En el caso que se quieran elementos
		// con grados de libertad que no se ubiquen
		// en los nodos principales hay que modificar esto

		int k = 0;
		for (int i = 0; i < this->k; i++)
		{
			for (int j = 0; j < this->n; j++)
			{
				this->Ue(k) = U(this->gdl[i][j]);
				k++;
			}
		}
	}

	bool Element::isInside(Eigen::MatrixXd &x)
	{
		return false;
	}

} // namespace FEM
