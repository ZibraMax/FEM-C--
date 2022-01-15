#include "Serendipity.h"

namespace FEM
{
	Serendipity::Serendipity(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl)
		: RectangularScheme(coords, gdl, 3)
	{
		//Definir bordes
	}

	Eigen::MatrixXd Serendipity::psis(Eigen::MatrixXd &z)
	{
		int n_z = z.row(0).size();
		Eigen::MatrixXd res(this->n, n_z);
		Eigen::ArrayXd _z = z.row(0).array();
		Eigen::ArrayXd _n = z.row(1).array();
		res << (0.25 * (1.0 - _z) * (1.0 - _n) * (-1.0 - _z - _n)).matrix().transpose(),
			(0.25 * (1.0 + _z) * (1.0 - _n) * (-1.0 + _z - _n)).matrix().transpose(),
			(0.25 * (1.0 + _z) * (1.0 + _n) * (-1.0 + _z + _n)).matrix().transpose(),
			(0.25 * (1.0 - _z) * (1.0 + _n) * (-1.0 - _z + _n)).matrix().transpose(),
			(0.5 * (1.0 - _z * _z) * (1.0 - _n)).matrix().transpose(),
			(0.5 * (1.0 + _z) * (1.0 - _n * _n)).matrix().transpose(),
			(0.5 * (1.0 - _z * _z) * (1.0 + _n)).matrix().transpose(),
			(0.5 * (1.0 - _z) * (1.0 - _n - _n)).matrix().transpose();
		return res;
	}

	std::vector<Eigen::MatrixXd> Serendipity::dpsis(Eigen::MatrixXd &z)
	{
		std::vector<Eigen::MatrixXd> res;
		int n = z.row(0).size();
		for (int i = 0; i < n; i++)
		{
			Eigen::MatrixXd matrix(this->n, this->m);
			double _z = z(0, i);
			double _n = z(1, i);
			matrix << -0.25 * (_n - 1.0) * (2.0 * _z + _n),
				-0.25 * (_z - 1.0) * (2.0 * _n + _z),
				-0.25 * (_n - 1.0) * (2.0 * _z - _n),
				0.25 * (_z + 1.0) * (2.0 * _n - _z),
				0.25 * (_n + 1.0) * (2.0 * _z + _n),
				0.25 * (_z + 1.0) * (2.0 * _n + _z),
				0.25 * (_n + 1.0) * (2.0 * _z - _n),
				-0.25 * (_z - 1.0) * (2.0 * _n - _z),
				(_n - 1.0) * _z, 0.5 * (_z * _z - 1.0),
				-0.5 * (_n * _n - 1.0), -_n * (_z + 1.0),
				-(_n + 1.0) * _z, -0.5 * (_z * _z - 1.0),
				0.5 * (_n * _n - 1.0), _n * (_z - 1.0);
			res.push_back(matrix);
		}

		return res;
	}

} // namespace FEM
