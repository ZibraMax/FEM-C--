#include "Utils.h"

std::vector<std::vector<double>> Utils::MxM(std::vector<std::vector<double>> A, std::vector<std::vector<double>> B)
{
	int n = A.size();
	std::vector<std::vector<double>> result;
	for (int i = 0; i < n; i++)
	{
		std::vector<double> fila;
		for (int j = 0; j < n; j++)
		{
			fila.push_back(0.0);
		}
		result.push_back(fila);
	}

	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < n; j++)
		{
			for (int k = 0; k < n; k++)
			{
				result[i][j] += A[i][k] * B[k][j];
			}
		}
	}

	return result;
}
