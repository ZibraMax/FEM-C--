#include "Core.h"

namespace FEM
{
	Core::Core(Geometry* geometry)
	{
		this->geometry = geometry;
		this->ngdl = geometry->ngdl;


		K=Eigen::MatrixXd(this->ngdl,this->ngdl);
		F=Eigen::VectorXd(this->ngdl);
		Q=Eigen::VectorXd(this->ngdl);
		S=Eigen::VectorXd(this->ngdl);
		U=Eigen::VectorXd(this->ngdl);

	}
} // namespace FEM

