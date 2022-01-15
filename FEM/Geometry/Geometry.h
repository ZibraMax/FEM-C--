#ifndef GEOMETRY_H
#define GEOMETRY_H

#include <iostream>
#include <string>
#include <vector>

// #include "Utils.h"

#include "nlohmann/json.hpp"

namespace FEM
{
	class Geometry
	{
	public:
		std::vector<std::vector<double>> nodes;
		std::vector<std::vector<int>> elements;
		std::vector<std::vector<int>> regions;
		std::vector<std::vector<int>> ebc;
		std::vector<std::vector<int>> nbc;

		void setEbc(std::vector<std::vector<int>> ebc);
		void setNbc(std::vector<std::vector<int>> nbc);

		Geometry(std::vector<std::vector<double>> nodes_coords,std::vector<std::vector<int>> dictionary, std::vector<std::vector<int>> regions = {});
		Geometry(nlohmann::json geometry_json);
		Geometry(std::string json_file);
	};
}
#endif