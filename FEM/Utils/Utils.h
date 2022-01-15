#ifndef UTILS_H
#define UTILS_H

#include <iostream>
#include <cmath>
#include <vector>

namespace Utils
{

	class GaussLegendre
	{
	public:
		double p(int n, double x);
		double dpdx(int n, double x);
		std::vector<double> z;
		std::vector<double> w;
		GaussLegendre(int n);
	};

} // namespace Utils

#endif