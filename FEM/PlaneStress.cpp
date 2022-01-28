#include "PlaneStress.h"

namespace FEM
{
	PlaneStress::PlaneStress(Geometry *geometry, double E, double v, double t, double rho, double fx, double fy) : Core(geometry)
	{
		this->E = E;
		this->v = v;
		this->t = t;
		this->rho = rho;
		this->fx = fx;
		this->fy = fy;

		this->C11 = this->E / (1.0 - (this->v * this->v));
		this->C12 = this->v * this->C11;
		this->C66 = this->E / 2.0 / (1.0 + this->v);

		if (this->geometry->nvn != 2)
		{
			std::cout << "WARNING: Border conditions lost. You have to use a geometry with 2 variables per node." << std::endl;
			this->geometry->nvn = 2;
			this->geometry->ebc = {};
			this->geometry->nbc = {};
			this->geometry->initializeElements();
		}
	}

	void PlaneStress::elementMatrices()
	{
		for (int ee = 0; ee < this->geometry->elements.size(); ee++)
		{
			Element *e = this->geometry->elements[ee];
			int m = e->n;
			int ezsize = e->z.cols();
			Eigen::MatrixXd Kuu = Eigen::MatrixXd::Zero(m, m);
			Eigen::MatrixXd Kuv = Eigen::MatrixXd::Zero(m, m);
			// Eigen::MatrixXd Kvu = Eigen::MatrixXd::Zero(m, m);
			Eigen::MatrixXd Kvv = Eigen::MatrixXd::Zero(m, m);
			Eigen::MatrixXd M = Eigen::MatrixXd::Zero(m, m);
			Eigen::VectorXd Fu = Eigen::VectorXd::Zero(m);
			Eigen::VectorXd Fv = Eigen::VectorXd::Zero(m);

			//Gauss points in global coordinates and Shape functions evaluated in gauss points
			std::vector<Eigen::MatrixXd> _p_and_x = e->T(e->z);
			Eigen::MatrixXd _p = _p_and_x[0].transpose();
			Eigen::MatrixXd _x = _p_and_x[1];
			//Jacobian evaluated in gauss points and shape functions derivatives in natural coordinates
			std::vector<std::vector<Eigen::MatrixXd>> dpz_and_jac = e->J(e->z);
			std::vector<Eigen::MatrixXd> jac = dpz_and_jac[0];
			std::vector<Eigen::MatrixXd> dpz = dpz_and_jac[1];
			std::vector<Eigen::MatrixXd> _j;
			std::vector<Eigen::MatrixXd> dpx;
			std::vector<double> detjac;

			//TODO Organizar los índices para no hacer transpuestas

			for (int j = 0; j < jac.size(); j++)
			{
				detjac.push_back(jac[j].determinant());
				_j.push_back(jac[j].inverse());
				dpx.push_back(_j[j] * dpz[j].transpose());
			}

			for (int i = 0; i < m; i++)
			{
				for (int j = 0; j < m; j++)
				{
					for (int k = 0; k < ezsize; k++)
					{
						Kuu(i, j) += (this->C11 * dpx[k](0, i) * dpx[k](0, j) + this->C66 * dpx[k](1, i) * dpx[k](1, j)) * detjac[k] * e->w[k];
						Kuv(i, j) += (this->C12 * dpx[k](0, i) * dpx[k](1, j) + this->C66 * dpx[k](1, i) * dpx[k](0, j)) * detjac[k] * e->w[k];
						Kvv(i, j) += (this->C11 * dpx[k](1, i) * dpx[k](1, j) + this->C66 * dpx[k](0, i) * dpx[k](0, j)) * detjac[k] * e->w[k];
						M(i, j) += (this->rho * _p(k, i) * _p(k, j)) * detjac[k] * e->w[k];
					}
				}
				for (int k = 0; k < ezsize; k++)
				{
					Fu(i) += _p(k, i) * this->fx * detjac[k] * e->w[k];
					Fv(i) += _p(k, i) * this->fy * detjac[k] * e->w[k];
				}
			}
			e->Ke.block(0, 0, m, m) += Kuu * this->t;
			e->Ke.block(0, m, m, m) += Kuv * this->t;
			e->Ke.block(m, 0, m, m) += Kuv.transpose() * this->t;
			e->Ke.block(m, m, m, m) += Kvv * this->t;

			e->Me.block(0, 0, m, m) += M * this->t;
			e->Me.block(m, m, m, m) += M * this->t;

			e->Fe.segment(0, m) += Fu * this->t;
			e->Fe.segment(m, m) += Fv * this->t;

			std::cout << (double)(ee + 1) / (double)this->geometry->elements.size() << std::endl;
		}
	}

} // namespace FEM
