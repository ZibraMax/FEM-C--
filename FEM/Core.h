#ifndef CORE_H
#define CORE_H

#include "Geometry.h"
#include "Element.h"
#include "Eigen/Dense"

namespace FEM
{

	class Core
	{
	public:
		Geometry* geometry;
		int ngdl;
		Core(Geometry* geometry);
	};
} // namespace FEM
#endif