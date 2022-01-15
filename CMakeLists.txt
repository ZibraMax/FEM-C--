cmake_minimum_required(VERSION 3.0.0)


project(FEM VERSION 0.1.0)

include(CTest)
enable_testing()

include(FetchContent)

FetchContent_Declare(json
	GIT_REPOSITORY https://github.com/nlohmann/json.git
	GIT_TAG v3.7.3)

FetchContent_GetProperties(json)
if(NOT json_POPULATED)
	FetchContent_Populate(json)
	add_subdirectory(${json_SOURCE_DIR} ${json_BINARY_DIR} EXCLUDE_FROM_ALL)
endif()

set(PROJECT_SOURCES
		main.cpp
		./FEM/Elements/Element.cpp
		./FEM/Elements/E2D/Element2D.cpp
		./FEM/Elements/E2D/LTriangular.cpp
		./FEM/Elements/E2D/QTriangular.cpp
		./FEM/Elements/E2D/Serendipity.cpp
		./FEM/Elements/E2D/Quadrilateral.cpp
		./FEM/Elements/E2D/TriangularScheme.cpp
		./FEM/Elements/E2D/RectangularScheme.cpp
		./FEM/Core.cpp
		./FEM/Geometry/Geometry.cpp
		./FEM/Utils/Utils.cpp)

set(PROJECT_HEADERS
		${PROJECT_SOURCE_DIR}/FEM
		${PROJECT_SOURCE_DIR}/FEM/Geometry
		${PROJECT_SOURCE_DIR}/FEM/Elements
		${PROJECT_SOURCE_DIR}/FEM/Elements/E2D
		${PROJECT_SOURCE_DIR}/FEM/Utils
		${PROJECT_SOURCE_DIR}/libs)

include_directories("${PROJECT_HEADERS}")

add_executable(FEM "${PROJECT_SOURCES}")
target_link_libraries(FEM PRIVATE nlohmann_json::nlohmann_json)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
