#include "LTriangular.h"

namespace FEM
{
	LTriangular::LTriangular(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: TriangularScheme(coords, gdl)
	{
		//Definir bordes
	}

	Eigen::MatrixXd LTriangular::psis(Eigen::MatrixXd z)
	{
		int n_z = this->w.size();
		Eigen::ArrayXd NOSOYRES(3, n_z); //ERROR ESTA AQUÍ
		std::cout << n_z << std::endl;
		Eigen::ArrayXd _z = z.row(0).array();
		Eigen::ArrayXd _n = z.row(1).array();
		std::cout << _z << std::endl;
		std::cout << _n << std::endl;
		std::cout << 1.0 - _z - _n << std::endl;
		NOSOYRES << 1.0 - _z - _n, _z, _n;
		return NOSOYRES.matrix();
	}

	std::vector<Eigen::MatrixXd> LTriangular::dpsis(Eigen::MatrixXd z)
	{
		return {};
	}

} // namespace FEM
