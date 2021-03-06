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
		this->initializeElements();
	}

	Geometry::Geometry(std::string json_file)
	{
		//open json file
		std::ifstream i(json_file);
		nlohmann::json j;
		i >> j;
		this->nodes = j["nodes"].get<std::vector<std::vector<double>>>();
		this->dictionary = j["dictionary"].get<std::vector<std::vector<int>>>();
		this->types = j["types"].get<std::vector<std::string>>();
		this->regions = j["regions"].get<std::vector<std::vector<int>>>();
		this->ebc = j["ebc"].get<std::vector<std::vector<double>>>();
		this->nbc = j["nbc"].get<std::vector<std::vector<double>>>();
		this->nvn = j["nvn"].get<int>();
		this->ngdl = j["ngdl"].get<int>();
		this->initializeElements();
	}

	void Geometry::initializeElements()
	{
		this->ngdl = this->nodes.size() * this->nvn;
		for (int i = 0; i < dictionary.size(); i++)
		{
			std::vector<int> element_nodes = dictionary[i];
			int n = element_nodes.size();
			std::vector<std::vector<double>> coords;
			std::vector<std::vector<int>> gdls;
			int ndim = nodes[0].size();
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
