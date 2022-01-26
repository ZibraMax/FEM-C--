#ifndef UTILS_H
#define UTILS_H

#include <iostream>
#include <cmath>
#include <vector>

namespace Utils
{

	double p(double x, int n);
	double dpdx(double x, int n);
	std::vector<double> darPuntos(int n);
	std::vector<double> darPesos(int n, std::vector<double> puntos);

} // namespace Utils

#endif