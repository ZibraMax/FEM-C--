#ifndef ELEMENT_H
#define ELEMENT_H

#include <iostream>
#include <vector>
namespace FEM
{

	class Element
	{
	private:
		void matrixVectorzToZeros();

	public:
		std::vector<std::vector<double>> coords;
		std::vector<std::vector<int>> gdl;
		bool border;
		int n;
		std::string properties;
		bool borderIntegrals;
		std::vector<std::vector<double>> Ke;
		std::vector<std::vector<double>> Fe;
		std::vector<std::vector<double>> Qe;
		std::vector<std::vector<double>> Ue;

		Element(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, bool border = false);

		std::vector<std::vector<double>> T(std::vector<std::vector<double>> z);
		std::vector<std::vector<std::vector<double>>> J(std::vector<std::vector<double>> z);
		std::vector<std::vector<double>> inverseMapping(std::vector<std::vector<double>> x, int n = 100);

		virtual std::vector<std::vector<double>> psis(std::vector<std::vector<double>> z);
		virtual std::vector<std::vector<std::vector<double>>> dpsis(std::vector<std::vector<double>> z);
	};
}

#endif