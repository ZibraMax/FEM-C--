#include "Geometry.h"

namespace FEM
{
	Geometry::Geometry(std::vector<std::vector<double>> nodes_coords,std::vector<std::vector<int>> dictionary,std::vector<std::vector<int>> regions)
	{
		this->nodes = nodes_coords;
		this->regions = regions;
		this->elements = dictionary;
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
