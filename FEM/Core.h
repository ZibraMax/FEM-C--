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
		Geometry *geometry;
		int ngdl;

		Eigen::MatrixXd K;
		Eigen::MatrixXd M;
		Eigen::VectorXd F;
		Eigen::VectorXd Q;
		Eigen::VectorXd S;
		Eigen::VectorXd U;

		Core(Geometry *geometry);
		void ensembling();
		void borderConditions();
		void solveES();
		virtual void elementMatrices();
	};
} // namespace FEM
#endif