#ifndef ELEMENT_H
#define ELEMENT_H

#include <iostream>
#include <vector>

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
};

#endif