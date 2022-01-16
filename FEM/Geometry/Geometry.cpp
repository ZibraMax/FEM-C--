#include "Geometry.h"

namespace FEM
{
	Geometry::Geometry(std::vector<std::vector<double>> nodes_coords,std::vector<std::vector<int>> dictionary,std::vector<std::string> types,std::vector<std::vector<int>> regions)
	{
		this->nodes = nodes_coords;
		this->regions = regions;
		this->types = types;
		this->dictionary = dictionary;
		for (int i = 0; i < dictionary.size(); i++)
		{	
			std::vector<int> element_nodes = dictionary[i];
			int n = element_nodes.size();
			std::vector<std::vector<double>> coords;
			std::vector<std::vector<int>> gdls;

			for (int j = 0; j < n; j++)
			{
				coords.push_back(this->nodes[element_nodes[j]]);
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

			if (this->types[i]=="T1V")
			{
				this->elements.push_back(new LTriangular(coords,gdls));

			} else if (this->types[i]=="T2V")
			{
				this->elements.push_back(new QTriangular(coords,gdls));

			} else if (this->types[i]=="C1V") {
				this->elements.push_back(new Quadrilateral(coords,gdls));

			} else if (this->types[i]=="C2V")
			{
				this->elements.push_back(new Serendipity(coords,gdls));
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

	void Geometry::setEbc(std::vector<std::vector<int>> ebc)
	{
		this->ebc = ebc;
	}

	void Geometry::setNbc(std::vector<std::vector<int>> nbc)
	{
		this->nbc = nbc;
	}
}
