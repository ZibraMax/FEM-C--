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


include_directories(${PROJECT_SOURCE_DIR}/FEM)
include_directories(${PROJECT_SOURCE_DIR}/FEM/Elements)
include_directories(${PROJECT_SOURCE_DIR}/FEM/Utils)
include_directories(${PROJECT_SOURCE_DIR}/libs)

add_executable(FEM main.cpp ./FEM/Elements/Element.cpp ./FEM/Utils/Utils.cpp)
target_link_libraries(FEM PRIVATE nlohmann_json::nlohmann_json)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
