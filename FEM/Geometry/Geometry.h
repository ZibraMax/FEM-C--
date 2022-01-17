#ifndef GEOMETRY_H
#define GEOMETRY_H

#include <iostream>
#include <string>
#include <vector>

// #include "Utils.h"

#include "Serendipity.h"
#include "Quadrilateral.h"
#include "LTriangular.h"
#include "QTriangular.h"

#include "nlohmann/json.hpp"

namespace FEM
{
	class Geometry
	{
	public:
		std::vector<std::vector<double>> nodes;
		std::vector<std::vector<int>> dictionary;
		std::vector<std::string> types;
		std::vector<std::vector<int>> regions;
		std::vector<std::vector<double>> ebc;
		std::vector<std::vector<double>> nbc;
		int nvn;
		int ngdl;

		std::vector<Element*> elements;

		void setEbc(std::vector<std::vector<double>> ebc);
		void setNbc(std::vector<std::vector<double>> nbc);

		Geometry(std::vector<std::vector<double>> nodes_coords,std::vector<std::vector<int>> dictionary, std::vector<std::string> types,int nvn, std::vector<std::vector<int>> regions = {});
		Geometry(nlohmann::json geometry_json);
		Geometry(std::string json_file);
		Geometry();


		friend std::ostream& operator << (std::ostream& output, const Geometry geometry);
	};
}
#endif