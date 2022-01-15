#include "QTriangular.h"

namespace FEM
{
	QTriangular::QTriangular(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: TriangularScheme(coords, gdl)
	{
		//Definir bordes
	}

	Eigen::MatrixXd QTriangular::psis(Eigen::MatrixXd &z)
	{
		int n_z = z.row(0).size();
		Eigen::MatrixXd res(this->n, n_z);
		Eigen::ArrayXd _z = z.row(0).array();
		Eigen::ArrayXd _n = z.row(1).array();
		res << (2.0*(_z+_n-1.0)*(_z+_n-0.5)).matrix().transpose(),
				(2.0*_z*(_z-0.5)).matrix().transpose(),
				(2.0*_n*(_n-0.5)).matrix().transpose(),
				(-4.0*(_z+_n-1.0)*(_z)).matrix().transpose(),
				(4.0*_z*_n).matrix().transpose(),
				(-4.0*_n*(_z+_n-1.0)).matrix().transpose();
		return res;
	}

	std::vector<Eigen::MatrixXd> QTriangular::dpsis(Eigen::MatrixXd &z)
	{
		std::vector<Eigen::MatrixXd> res;
		int n = z.row(0).size();
		for (int i = 0; i < n; i++)
		{
			Eigen::MatrixXd matrix(this->n, this->m);
			double _z = z(0, i);
			double _n = z(1, i);
			matrix << 4.0*_z+4.0*_n-3.0, 4.0*_n+4.0*_z-3.0,
					4.0*_z-1.0, 0*_z,
					0*_z, 4.0*_n-1.0,
					-8.0*_z-4.0*(_n-1.0), -4.0*_z,
					4.0*_n, 4.0*_z,
					-4.0*_n, -8.0*_n-4.0*_z+4.0;
			res.push_back(matrix);
		}

		return res;
	}

} // namespace FEM
