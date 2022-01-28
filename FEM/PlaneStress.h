#ifndef PLANE_STRESS_H
#define PLANE_STRESS_H

#include "Core.h"

namespace FEM
{
	class PlaneStress : public Core
	{
	public:
		double E;
		double v;
		double t;
		double rho;

		double fy;
		double fx;

		double C11;
		double C12;
		double C66;

		PlaneStress(Geometry *geometry, double E, double v, double t, double rho, double fx, double fy);
		void elementMatrices();
	};

}

#endif