#include "Geometry.h"

namespace FEM
{
	Geometry::Geometry()
	{
	}
	Geometry::Geometry(std::vector<std::vector<double>> nodes_coords, std::vector<std::vector<int>> dictionary, std::vector<std::string> types, int nvn, std::vector<std::vector<int>> regions)
	{
		this->nodes = nodes_coords;
		this->regions = regions;
		this->types = types;
		this->dictionary = dictionary;
		this->nvn = nvn;
		this->ngdl = this->nodes.size() * this->nvn;
		for (int i = 0; i < dictionary.size(); i++)
		{
			std::vector<int> element_nodes = dictionary[i];
			int n = element_nodes.size();
			std::vector<std::vector<double>> coords;
			std::vector<std::vector<int>> gdls;
			int ndim = nodes_coords[0].size();
			for (int j = 0; j < ndim; j++)
			{
				std::vector<double> dimension;
				for (int k = 0; k < n; k++)
				{
					dimension.push_back(this->nodes[element_nodes[k]][j]);
				}
				coords.push_back(dimension);
			}

			for (int k = 0; k < this->nvn; k++)
			{
				std::vector<int> linea = element_nodes;
				for (int j = 0; j < linea.size(); j++)
				{
					linea[j] = linea[j] * this->nvn + k;
				}
				gdls.push_back(linea);
			}

			if (this->types[i] == "T1V")
			{
				this->elements.push_back(new LTriangular(coords, gdls));
			}
			else if (this->types[i] == "T2V")
			{
				this->elements.push_back(new QTriangular(coords, gdls));
			}
			else if (this->types[i] == "C1V")
			{
				this->elements.push_back(new Quadrilateral(coords, gdls));
			}
			else if (this->types[i] == "C2V")
			{
				this->elements.push_back(new Serendipity(coords, gdls));
			}
		}
	}

	Geometry::Geometry(nlohmann::json geometry_json)
	{
		//load all stuff from JSON object
	}

	Geometry::Geometry(std::string json_file)
	{
		//load all stuff from JSON file
	}

	void Geometry::setEbc(std::vector<std::vector<double>> ebc)
	{
		this->ebc = ebc;
	}

	void Geometry::setNbc(std::vector<std::vector<double>> nbc)
	{
		this->nbc = nbc;
	}

	std::ostream &operator<<(std::ostream &output, const Geometry geometry)
	{
		output << "Geometry " << std::endl;
		output << "DOF: " << geometry.ngdl << std::endl;
		output << "Number of elements: " << geometry.elements.size() << std::endl;
		output << "---------------------------------" << std::endl;
		for (int i = 0; i < geometry.elements.size(); ++i)
		{
			std::cout << "Element " << i + 1 << ": " << *geometry.elements[i] << std::endl;
		}
		output << "End of geometry";
		return output;
	}
}
