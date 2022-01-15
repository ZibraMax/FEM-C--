#include "Utils.h"
const double Pi = 3.141592653589793238463;
namespace Utils
{
	GaussLegendre::GaussLegendre(int n)
	{
		double tol = 0.00000000000001;
		for (int i = 0; i < n; i++)
		{
			double xi = cos(Pi * (((double)i) - 0.25) / (((double)n) + 0.5));
			double err = 1.0;
			while (err > tol)
			{
				double delta = p(n, xi) / dpdx(n, xi);
				xi -= delta;
				err = abs(delta);
			}
			double dpnxi = dpdx(n, xi);
			double wi = 2.0 / ((1 - xi * xi) * (dpnxi * dpnxi));

			z.push_back(xi);
			w.push_back(wi);
		}
	}
	double GaussLegendre::p(int n, double x)
	{
		if (n == 0)
		{
			return 1.0;
		}
		else if (n == 1)
		{
			return x;
		}
		else
		{
			double N = (double)n;
			return ((2.0 * N - 1.0) * x * (p(n - 1, x)) - (N - 1.0) * p(n - 2, x)) / (N);
		}
	}
	double GaussLegendre::dpdx(int n, double x)
	{
		double N = (double)n;
		return N / (x * x - 1) * (x * p(n, x) - p(n - 1, x));
	}

} // namespace Utils