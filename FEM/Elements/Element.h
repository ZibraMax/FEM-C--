#ifndef ELEMENT_H
#define ELEMENT_H

#include <iostream>
#include <vector>
#include "Eigen/Dense"

namespace FEM
{

	class Element
	{
	public:
		Element(std::vector<std::vector<double>> coords, std::vector<std::vector<int>> gdl, bool border = false);

		int n;							   // Número de nodos
		int m;							   // Númerod de dimensiones
		Eigen::MatrixXd coords;			   // Coordenadas mxn
		std::vector<std::vector<int>> gdl; // Grados de libertad mxn
		bool border;					   // Si es un elemento de borde
		std::string properties;
		bool borderIntegrals;
		Eigen::MatrixXd Ke;
		Eigen::VectorXd Fe;
		Eigen::VectorXd Qe;
		Eigen::VectorXd Ue;

		void matrixVectorzToZeros();
		Eigen::MatrixXd T(Eigen::MatrixXd z);
		std::vector<Eigen::MatrixXd> J(Eigen::MatrixXd z);
		Eigen::MatrixXd inverseMapping(Eigen::MatrixXd x, int n = 100);

		virtual Eigen::MatrixXd psis(Eigen::MatrixXd z);
		virtual std::vector<Eigen::MatrixXd> dpsis(Eigen::MatrixXd z);
	};
}

#endif