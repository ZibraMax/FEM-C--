#include "Element.h"
#include "Utils.h"

namespace FEM
{

	Element::Element(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, bool border)
	{
		this->coords = coords;
		this->gdl = gdl;
		this->border = border;

		this->n = coords[0].size(); // Número de nodos
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
		this->Ke = {};
		this->Qe = {};
		this->Fe = {};
		this->Ue = {};

		for (int i = 0; i < n; i++)
		{
			std::vector<double> line;
			std::vector<double> vect = {0.0};
			for (int j = 0; j < n; j++)
			{
				line.push_back(0);
			}
			this->Ke.push_back(line);
			this->Fe.push_back(vect);
			this->Qe.push_back(vect);
			this->Ue.push_back(vect);
		}
	}

	std::vector<std::vector<double>> Element::T(std::vector<std::vector<double>> z)
	{
		return Utils::MxM(this->psis(z), this->coords);
	}
	std::vector<std::vector<std::vector<double>>> Element::J(std::vector<std::vector<double>> z)
	{
		std::vector<std::vector<std::vector<double>>> dpsis = this->dpsis(z);
		std::vector<std::vector<std::vector<double>>> result;
		for (int i = 0; i < dpsis.size(); i++)
		{
			result.push_back(Utils::MxM(dpsis[i], this->coords));
		}

		return result;
	}

	std::vector<std::vector<double>> Element::inverseMapping(std::vector<std::vector<double>> x, int n)
	{
		return x;
	}

	std::vector<std::vector<double>> Element::psis(std::vector<std::vector<double>> z)
	{
		return {};
	}

	std::vector<std::vector<std::vector<double>>> Element::dpsis(std::vector<std::vector<double>> z)
	{
		return {};
	}

} // namespace FEM
